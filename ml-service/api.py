from fastapi import FastAPI
import pandas as pd
import numpy as np
import joblib

# =====================================================
# LOAD MODEL
# =====================================================

model = joblib.load("models/groundwater_trend_model.pkl")

app = FastAPI(title="Groundwater AI API")

# =====================================================
# CONSTANTS
# =====================================================

RAIN_DATE = "Data Acquisition Time"
GW_DATE = "Data Acquisition Time"

RAIN_COL = "Telemetry Hourly Rainfall (mm)"
GW_COL = "Groundwater Level Telemetry 6 Hourly (meter)"

MODEL_FEATURES = [
    "month",
    "gw_lag_7",
    "gw_lag_30",
    "rain_7",
    "rain_30",
    "rain_90",
]

# =====================================================
# DATA PREPARATION
# =====================================================

def prepare_full_feature_dataframe():

    rainfall = pd.read_csv("data/rainfall.csv")
    groundwater = pd.read_csv("data/groundwater.csv")

    rainfall[RAIN_DATE] = pd.to_datetime(
        rainfall[RAIN_DATE], dayfirst=True, errors="coerce"
    )
    groundwater[GW_DATE] = pd.to_datetime(
        groundwater[GW_DATE], dayfirst=True, errors="coerce"
    )

    rainfall.dropna(subset=[RAIN_DATE], inplace=True)
    groundwater.dropna(subset=[GW_DATE], inplace=True)

    rainfall["date"] = rainfall[RAIN_DATE].dt.floor("D")
    groundwater["date"] = groundwater[GW_DATE].dt.floor("D")

    rain_daily = rainfall.groupby("date")[RAIN_COL].sum().reset_index()
    gw_daily = groundwater.groupby("date")[GW_COL].mean().reset_index()

    df = pd.merge(gw_daily, rain_daily, on="date", how="inner")
    df = df.sort_values("date")

    # ===== feature engineering =====
    df["gw_smooth"] = df[GW_COL].rolling(7).mean()

    df["rain_7"] = df[RAIN_COL].rolling(7).sum()
    df["rain_30"] = df[RAIN_COL].rolling(30).sum()
    df["rain_90"] = df[RAIN_COL].rolling(90).sum()

    df["gw_lag_7"] = df["gw_smooth"].shift(7)
    df["gw_lag_30"] = df["gw_smooth"].shift(30)

    df["month"] = df["date"].dt.month

    df.dropna(inplace=True)

    return df


# =====================================================
# RECURSIVE FORECAST ENGINE
# =====================================================

def recursive_forecast(days=30):

    df = prepare_full_feature_dataframe()
    current = df.iloc[-1:].copy()

    predictions = []

    for _ in range(days):

        X = current[MODEL_FEATURES].astype(float)

        probs = model.predict_proba(X)[0]
        prediction = int(np.argmax(probs))

        last_level = float(current.iloc[0]["gw_smooth"])

        change = 0.03 if prediction == 1 else -0.03
        next_level = last_level + change

        predictions.append(round(next_level, 3))

        # update simulated future row
        next_row = current.copy()

        next_row.loc[:, "gw_smooth"] = next_level
        next_row.loc[:, "rain_7"] *= 0.95
        next_row.loc[:, "rain_30"] *= 0.97
        next_row.loc[:, "rain_90"] *= 0.99
        next_row.loc[:, "month"] = int(current.iloc[0]["month"]) % 12 + 1

        current = next_row

    return predictions


# =====================================================
# ROOT
# =====================================================

@app.get("/")
def root():
    return {"message": "Groundwater AI API Running"}


# =====================================================
# HISTORY API
# =====================================================

@app.get("/history")
def get_history():

    groundwater = pd.read_csv("data/groundwater.csv")

    groundwater[GW_DATE] = pd.to_datetime(
        groundwater[GW_DATE], dayfirst=True, errors="coerce"
    )

    groundwater["date"] = groundwater[GW_DATE].dt.date

    daily = (
        groundwater.groupby("date")[GW_COL]
        .mean()
        .reset_index()
    )

    return {
        "history": [
            {
                "date": str(r["date"]),
                "groundwater": float(r[GW_COL]),
            }
            for _, r in daily.iterrows()
        ]
    }


# =====================================================
# PREDICT LEVEL (ANY DATE)
# =====================================================

@app.get("/predict-level")
def predict_level(date: str):

    try:
        df = prepare_full_feature_dataframe()

        target_date = pd.to_datetime(date)
        last_date = df["date"].max()

        # ---------- historical ----------
        if target_date <= last_date:

            row = df[df["date"] <= target_date].tail(1)

            X = row[MODEL_FEATURES].astype(float)

            probs = model.predict_proba(X)[0]
            prediction = int(np.argmax(probs))
            confidence = float(np.max(probs))

            level = float(row.iloc[0]["gw_smooth"])

        # ---------- future ----------
        else:

            days_ahead = (target_date - last_date).days

            forecasts = recursive_forecast(days_ahead)

            level = forecasts[-1]

            prediction = 1 if forecasts[-1] > forecasts[-2] else 0
            confidence = 0.65

        trend = "Rising" if prediction == 1 else "Falling"

        return {
            "date": str(target_date.date()),
            "predicted_level": round(level, 3),
            "confidence": round(confidence, 3),
            "trend": trend,
        }

    except Exception as e:
        print("Prediction Error:", e)
        return {"error": str(e)}


# =====================================================
# FORECAST API
# =====================================================

@app.get("/forecast")
def forecast(days: int = 30):
    return {"forecast": recursive_forecast(days)}


# =====================================================
# STATIONS MAP DATA
# =====================================================

@app.get("/stations")
def get_station_data():

    groundwater = pd.read_csv("data/groundwater.csv")

    groundwater[GW_DATE] = pd.to_datetime(
        groundwater[GW_DATE], dayfirst=True, errors="coerce"
    )

    latest = (
        groundwater.sort_values(GW_DATE)
        .groupby("Station")
        .tail(1)
    )

    stations = latest[
        ["Station", "Latitude", "Longitude", GW_COL]
    ]

    return {
        "stations": stations.rename(columns={
            "Station": "name",
            "Latitude": "lat",
            "Longitude": "lon",
            GW_COL: "level"
        }).to_dict(orient="records")
    }

@app.post("/predict-trend")
def predict_trend():

    df = prepare_full_feature_dataframe()

    latest = df.iloc[-1:]

    X = latest[MODEL_FEATURES].astype(float)

    probs = model.predict_proba(X)[0]
    prediction = int(np.argmax(probs))
    confidence = float(np.max(probs))

    trend = "Rising" if prediction == 1 else "Falling"

    # =====================
    # RISK CALCULATION
    # =====================

    rain_30 = float(latest.iloc[0]["rain_30"])
    rain_90 = float(latest.iloc[0]["rain_90"])
    month = int(latest.iloc[0]["month"])

    risk_score = 0

    if rain_30 < 50:
        risk_score += 1
    if rain_90 < 150:
        risk_score += 1
    if trend == "Falling":
        risk_score += 1

    if risk_score <= 1:
        risk = "Low"
    elif risk_score == 2:
        risk = "Moderate"
    else:
        risk = "High"

    # =====================
    # HEALTH SCORE
    # =====================

    score = 100

    if rain_30 < 50:
        score -= 25
    if rain_90 < 150:
        score -= 20
    if trend == "Falling":
        score -= 25
    if month in [3, 4, 5]:
        score -= 15

    score = max(0, min(100, score))

    return {
        "trend": trend,
        "confidence": round(confidence, 3),
        "risk": risk,
        "health_score": score,
        "insight": f"Groundwater trend is {trend.lower()} with {risk.lower()} risk."
    }
