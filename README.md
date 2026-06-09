# 💧 Groundwater Stewardship System

A full-stack AI-powered groundwater monitoring, visualization, and forecasting platform designed to help citizens, researchers, and government agencies understand groundwater trends, identify risk zones, and forecast future groundwater conditions using Machine Learning.

---

## 📖 Project Overview

Groundwater levels across many regions are declining due to over-extraction, climate variability, and inadequate monitoring systems. This project provides an intelligent platform for groundwater data management, visualization, analysis, and forecasting.

The system combines:

* Real-time groundwater data management
* Interactive dashboards and maps
* Risk zone identification
* Machine Learning-based forecasting
* Government dataset integration
* Data-driven decision support

---

## 🎯 Problem Statement

Groundwater resources are critical for drinking water, agriculture, and industry. However:

* Groundwater levels are declining in many regions.
* Monitoring data is difficult for citizens to understand.
* Limited forecasting tools exist for future groundwater conditions.
* Decision-makers lack intuitive visualization tools.

This project addresses these challenges through a centralized groundwater intelligence platform.

---

# 🚀 Key Features

## 📊 Dashboard

* Groundwater KPI cards
* Current groundwater status
* Risk indicators (Safe / Warning / Critical)
* AI-generated insights
* Interactive groundwater map

---

## 📂 Groundwater Data Management

Complete CRUD operations:

### Create

* Add groundwater records

### Read

* View all monitoring data

### Update

* Edit existing records

### Delete

* Remove records

---

## 🗺️ Geospatial Visualization

* Interactive map visualization
* Monitoring station locations
* Risk-based color indicators
* Groundwater status visualization

---

## 📈 Analytics Module

Multiple groundwater analytics charts:

### Historical Trend Analysis

* Groundwater level trends over time

### Seasonal Analysis

* Monthly groundwater patterns

### Location Comparison

* Station-wise comparisons

### Risk Distribution

* Safe / Warning / Critical zone distribution

### Groundwater Distribution

* Groundwater level histogram

### Forecast Analytics

* Historical + future prediction chart

---

## 🤖 Machine Learning Forecasting

### Model

Random Forest Regressor

### Features Used

* Year
* Month
* Latitude
* Longitude
* Level Difference
* Station ID
* Lag1
* Lag2
* Lag3

### Model Performance

Current Results:

```text
R² Score = 0.787

MAE = 2.16 meters
```

### Forecasting

* Predicts groundwater conditions for next 12 months
* Generates future groundwater trends
* Risk forecasting
* Health Index calculation

---

## 🧠 AI Insights

The system automatically generates insights such as:

```text
Groundwater conditions are expected to decline over the next year.

Nashik is approaching a groundwater stress zone.

Groundwater levels remain stable across monitoring stations.
```

---

# 🏗️ System Architecture

```text
React Frontend
        │
        ▼
Node.js Backend
        │
        ▼
MongoDB Database
        │
        ▼
FastAPI ML Service
        │
        ▼
Random Forest Model
```

---

# 📂 Project Structure

```text
Groundwater Stewardship
│
├── groundwater-frontend
│   │
│   ├── src
│   │   ├── components
│   │   ├── pages
│   │   ├── layout
│   │   ├── services
│   │   └── utils
│
├── groundwater-backend
│   │
│   ├── controllers
│   ├── models
│   ├── routes
│   ├── config
│   └── server.js
│
├── groundwater-ml
│   │
│   ├── dataset
│   ├── train_model.py
│   ├── forecast_next12.py
│   ├── ml_api.py
│   └── groundwater_model.pkl
│
└── README.md
```

---

# 🛠️ Tech Stack

## Frontend

* React.js
* Vite
* Axios
* React Router DOM
* Recharts
* Leaflet

---

## Backend

* Node.js
* Express.js
* MongoDB
* Mongoose

---

## Machine Learning

* Python
* FastAPI
* Pandas
* Scikit-Learn
* Joblib

---

## Database

* MongoDB Atlas

---

# 📊 Datasets Used

## 1. Groundwater Monitoring Dataset

Used for:

* ML Training
* Forecasting
* Trend Analysis
* Station-wise Analytics

Contains:

* Station Name
* Groundwater Levels
* Dates
* Latitude
* Longitude
* Level Difference

---

## 2. Groundwater Resource Dataset

Used for:

* Recharge Analysis
* Extraction Analysis
* Sustainability Assessment

---

## 3. District Groundwater Dataset

Used for:

* District Comparisons
* Groundwater Stress Assessment

---

## 4. Water Quality Dataset

Used for:

* Environmental Monitoring
* Water Quality Insights

---

# ⚙️ Installation

## Clone Repository

```bash
git clone https://github.com/your-repo/groundwater-stewardship.git
```

---

## Backend Setup

```bash
cd groundwater-backend

npm install

npm run dev
```

Server:

```text
http://localhost:5000
```

---

## Frontend Setup

```bash
cd groundwater-frontend

npm install

npm run dev
```

Frontend:

```text
http://localhost:5173
```

---

## ML Service Setup

Create Virtual Environment:

```bash
python -m venv venv
```

Activate:

```bash
venv\Scripts\activate
```

Install Dependencies:

```bash
pip install -r requirements.txt
```

Train Model:

```bash
python train_model.py
```

Run ML API:

```bash
uvicorn ml_api:app --reload --port 8000
```

ML API:

```text
http://localhost:8000
```

---

# 🔄 API Endpoints

## Groundwater Data

### Get Records

```http
GET /api/groundwater
```

### Create Record

```http
POST /api/groundwater
```

### Update Record

```http
PUT /api/groundwater/:id
```

### Delete Record

```http
DELETE /api/groundwater/:id
```

---

## ML Forecast

### Future Prediction

```http
GET /api/groundwater/forecast
```

Returns:

```json
{
  "forecast": [
    {
      "year": 2026,
      "month": 8,
      "predicted_level": 1.87,
      "health_index": 72,
      "risk": "Safe"
    }
  ]
}
```

---

# 🌍 Future Enhancements

* IoT Sensor Integration
* Live Groundwater Monitoring
* Rainfall Data Integration
* LSTM Time-Series Forecasting
* Automated Model Retraining
* PDF Report Generation
* Government Data API Integration
* Mobile Application
* Alert Notification System
* Multi-District Forecasting

---

# 📜 License

This project is developed for educational, research, and groundwater resource management purposes.

---

## 🌊 Vision

To make groundwater data understandable, actionable, and accessible through modern visualization, machine learning forecasting, and intelligent decision-support tools that promote sustainable groundwater management.
