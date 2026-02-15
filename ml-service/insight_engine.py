import pandas as pd
import joblib
from datetime import datetime

# =====================================================
# LOAD MODEL
# =====================================================

model = joblib.load("models/groundwater_trend_model.pkl")

RAIN_DATE = "Data Acquisition Time"
GW_DATE = "Data Acquisition Time"

RAIN_COL = "Telemetry Hourly Rainfall (mm)"
GW_COL = "Groundwater Level Telemetry 6 Hourly (meter)"

# =====================================================
# LOAD DATA
# =====================================================

rainfall = pd.read_csv("data/rainfall.csv")
groundwater = pd.read_csv("data/groundwater.csv")

rainfall[RAIN_DATE] = pd.to_datetime(rainfall[RAIN_DATE], errors="coerce")
groundwater[GW_DATE] = pd.to_datetime(groundwater[GW_DATE], errors="coerce")

rainfall.dropna(subset=[RAIN_DATE], inplace=True)
groundwater.dropna(subset=[GW_DATE], inplace=True)

# =====================================================
# DAILY DATA PREPARATION
# =====================================================

rainfall["date"] = rainfall[RAIN_DATE].dt.floor("D")
groundwater["date"] = groundwater[GW_DATE].dt.floor("D")

rain_daily = rainfall.groupby("date")[RAIN_COL].sum().reset_index()
gw_daily = groundwater.groupby("date")[GW_COL].mean().reset_index()

df = pd.merge(gw_daily, rain_daily, on="date", how="inner")
df = df.sort_values("date")

# =====================================================
# FEATURE ENGINEERING (same as training)
# =====================================================

df["gw_smooth"] = df[GW_COL].rolling(7).mean()

df["rain_7"] = df[RAIN_COL].rolling(7).sum()
df["rain_30"] = df[RAIN_COL].rolling(30).sum()
df["rain_90"] = df[RAIN_COL].rolling(90).sum()

df["gw_lag_7"] = df["gw_smooth"].shift(7)
df["gw_lag_30"] = df["gw_smooth"].shift(30)

df["month"] = df["date"].dt.month

df.dropna(inplace=True)

# =====================================================
# TAKE LATEST RECORD
# =====================================================

latest = df.iloc[-1]

features = [
    "month",
    "gw_lag_7",
    "gw_lag_30",
    "rain_7",
    "rain_30",
    "rain_90",
]

X_latest = latest[features].values.reshape(1, -1)

# =====================================================
# PREDICT TREND
# =====================================================

prediction = model.predict(X_latest)[0]

trend_map = {
    1: "Rising",
    0: "Falling"
}

trend = trend_map[prediction]

# =====================================================
# RISK SCORE LOGIC (HYBRID AI)
# =====================================================

risk_score = 0

if latest["rain_30"] < 50:
    risk_score += 1

if latest["rain_90"] < 150:
    risk_score += 1

if trend == "Falling":
    risk_score += 1

if latest["month"] in [3, 4, 5]:  # summer season
    risk_score += 1

# risk label
if risk_score <= 1:
    risk = "Low"
elif risk_score == 2:
    risk = "Moderate"
else:
    risk = "High"

# =====================================================
# GENERATE AI INSIGHT
# =====================================================

if risk == "High":
    insight = (
        "Groundwater levels are declining due to insufficient rainfall "
        "and seasonal water stress. Immediate conservation measures are recommended."
    )
elif risk == "Moderate":
    insight = (
        "Groundwater shows moderate stress. Continued monitoring "
        "and controlled usage are advised."
    )
else:
    insight = (
        "Groundwater conditions are currently stable with adequate recharge."
    )

# =====================================================
# OUTPUT RESULT
# =====================================================

result = {
    "date": str(latest["date"].date()),
    "trend": trend,
    "risk_level": risk,
    "insight": insight
}

print("\n===== AI GROUNDWATER INSIGHT =====")
print(result)
