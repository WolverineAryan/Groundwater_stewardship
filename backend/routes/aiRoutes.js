import express from "express";
import axios from "axios";

const router = express.Router();

// Python ML API URL
const ML_API = "http://127.0.0.1:8000";

/*
   GET /api/ai/predict
*/
router.get("/predict", async (req, res) => {
  try {
    const response = await axios.post(`${ML_API}/predict-trend`);

    res.json(response.data);
  } catch (error) {
    console.error("AI API Error:", error.message);

    res.status(500).json({
      message: "Failed to get AI prediction",
    });
  }
});

router.get("/stations", async (req, res) => {
  try {
    const response = await axios.get(`${ML_API}/stations`);
    res.json(response.data);
  } catch {
    res.status(500).json({ message: "Station data failed" });
  }
});

router.get("/forecast", async (req, res) => {
  try {
    const response = await axios.get(`${ML_API}/forecast`);
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ message: "Forecast failed" });
  }
});

router.get("/history", async (req, res) => {
  try {
    const response = await axios.get(`${ML_API}/history`);
    res.json(response.data);
  } catch (err) {
    res.status(500).json({ message: "History fetch failed" });
  }
});

router.get("/predict-level", async (req, res) => {
  try {
    const { date } = req.query;
    const response = await axios.get(
      `${ML_API}/predict-level?date=${date}`
    );
    res.json(response.data);
  } catch {
    res.status(500).json({ message: "Prediction failed" });
  }
});

export default router;
