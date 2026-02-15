import express from "express";
import axios from "axios";

const router = express.Router();

const AI_API = "http://127.0.0.1:8000";

// =========================
// AI TREND
// =========================
router.post("/prediction", async (req, res) => {
  try {
    const response = await axios.post(
      `${AI_API}/predict-trend`
    );

    res.json(response.data);
  } catch (err) {
    console.error("AI API Error:", err.message);
    res.status(500).json({ error: "AI service failed" });
  }
});

// =========================
// HISTORY
// =========================
router.get("/history", async (req, res) => {
  try {
    const response = await axios.get(
      `${AI_API}/history`
    );

    res.json(response.data);
  } catch (err) {
    console.error("AI API Error:", err.message);
    res.status(500).json({ error: "AI service failed" });
  }
});

// =========================
// FORECAST
// =========================
router.get("/forecast", async (req, res) => {
  try {
    const response = await axios.get(
      `${AI_API}/forecast`
    );

    res.json(response.data);
  } catch (err) {
    console.error("AI API Error:", err.message);
    res.status(500).json({ error: "AI service failed" });
  }
});

// =========================
// PREDICT LEVEL
// =========================
router.get("/predict-level", async (req, res) => {
  try {
    const { date } = req.query;

    const response = await axios.get(
      `${AI_API}/predict-level`,
      { params: { date } }
    );

    res.json(response.data);
  } catch (err) {
    console.error("AI API Error:", err.message);
    res.status(500).json({ error: "AI service failed" });
  }
});

export default router;
