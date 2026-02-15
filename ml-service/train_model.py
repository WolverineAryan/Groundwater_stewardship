import pandas as pd
import numpy as np
import joblib
import os
from xgboost import XGBClassifier
from sklearn.metrics import accuracy_score, classification_report

# =====================================================
# SETUP
# =====================================================

os.makedirs("models", exist_ok=True)

RAIN_DATE = "Data Acquisition Time"
GW_DATE = "Data Acquisition Time"

RAIN_COL = "Telemetry Hourly Rainfall (mm)"
GW_COL = "Groundwater Level Telemetry 6 Hourly (meter)"

# =====================================================
# LOAD DATA
# =====================================================

print("Loading datasets...")

rainfall = pd.read_csv("data/rainfall.csv")
groundwater = pd.read_csv("data/groundwater.csv")

rainfall[RAIN_DATE] = pd.to_datetime(rainfall[RAIN_DATE], errors="coerce")
groundwater[GW_DATE] = pd.to_datetime(groundwater[GW_DATE], errors="coerce")

rainfall.dropna(subset=[RAIN_DATE], inplace=True)
groundwater.dropna(subset=[GW_DATE], inplace=True)

# =====================================================
# DAILY BASIN DATA
# =====================================================

rainfall["date"] = rainfall[RAIN_DATE].dt.floor("D")
groundwater["date"] = groundwater[GW_DATE].dt.floor("D")

rain_daily = rainfall.groupby("date")[RAIN_COL].sum().reset_index()
gw_daily = groundwater.groupby("date")[GW_COL].mean().reset_index()

df = pd.merge(gw_daily, rain_daily, on="date", how="inner")
df = df.sort_values("date")

print("Merged rows:", len(df))

# =====================================================
# SMOOTH GROUNDWATER SIGNAL
# =====================================================

df["gw_smooth"] = df[GW_COL].rolling(7).mean()

# =====================================================
# WEEKLY TREND TARGET (BIG IMPROVEMENT)
# =====================================================
# Predict change AFTER 7 days instead of daily noise

df["gw_future"] = df["gw_smooth"].shift(-7)
df["gw_change"] = df["gw_future"] - df["gw_smooth"]

# Rising = 1, Falling = 0
df["trend"] = (df["gw_change"] > 0).astype(int)

# =====================================================
# FEATURE ENGINEERING
# =====================================================

# rainfall recharge windows
df["rain_7"] = df[RAIN_COL].rolling(7).sum()
df["rain_30"] = df[RAIN_COL].rolling(30).sum()
df["rain_90"] = df[RAIN_COL].rolling(90).sum()
df["rain_momentum"] = df["rain_7"] - df["rain_30"] / 4

# groundwater memory
df["gw_lag_7"] = df["gw_smooth"].shift(7)
df["gw_lag_30"] = df["gw_smooth"].shift(30)

# seasonal cyclic encoding (VERY IMPORTANT)
df["month"] = df["date"].dt.month
df["month_sin"] = np.sin(2 * np.pi * df["month"] / 12)
df["month_cos"] = np.cos(2 * np.pi * df["month"] / 12)

df.dropna(inplace=True)

print("Dataset after feature engineering:", df.shape)

# =====================================================
# FEATURES / TARGET
# =====================================================

features = [
    "month",
    "gw_lag_7",
    "gw_lag_30",
    "rain_7",
    "rain_30",
    "rain_90",
]


X = df[features]
y = df["trend"]

# =====================================================
# TIME SERIES SPLIT
# =====================================================

split = int(len(df) * 0.8)

X_train = X.iloc[:split]
X_test = X.iloc[split:]

y_train = y.iloc[:split]
y_test = y.iloc[split:]

# =====================================================
# HANDLE CLASS IMBALANCE
# =====================================================

pos = sum(y_train == 1)
neg = sum(y_train == 0)
scale_pos_weight = neg / pos if pos > 0 else 1

# =====================================================
# TRAIN MODEL (FINE-TUNED)
# =====================================================
print("Training Weekly Trend Model (Fine-Tuned)...")

model = XGBClassifier(
    n_estimators=220,        # reduced to prevent overfit
    learning_rate=0.035,
    max_depth=3,
    min_child_weight=6,
    subsample=0.75,
    colsample_bytree=0.75,
    gamma=0.25,
    reg_alpha=0.6,
    reg_lambda=1.8,
    scale_pos_weight=scale_pos_weight,
    random_state=42,
    eval_metric="logloss"
)

model.fit(X_train, y_train)

# =====================================================
# EVALUATION
# =====================================================

train_preds = model.predict(X_train)
probs = model.predict_proba(X_test)[:, 1]

# tuned threshold
test_preds = (probs > 0.45).astype(int)


train_acc = accuracy_score(y_train, train_preds)
test_acc = accuracy_score(y_test, test_preds)

print("\n✅ Train Accuracy:", round(train_acc, 3))
print("✅ Test Accuracy:", round(test_acc, 3))

print("\nClassification Report:\n")
print(classification_report(y_test, test_preds))

# =====================================================
# SAVE MODEL
# =====================================================

joblib.dump(model, "models/groundwater_trend_model.pkl")

print("✅ Final Weekly Trend Model saved!")
