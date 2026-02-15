const BASE_URL = "http://localhost:5000/api/ai";

export async function getAIPrediction() {
  try {
    const res = await fetch(`${BASE_URL}/predict`);

    if (!res.ok) {
      throw new Error("Failed to fetch AI prediction");
    }

    return await res.json();
  } catch (error) {
    console.error("AI Prediction Error:", error);
    return null;
  }
}

export async function getForecast() {
  try {
    const res = await fetch(`${BASE_URL}/forecast`);

    if (!res.ok) {
      throw new Error("Forecast request failed");
    }

    return await res.json();
  } catch (error) {
    console.error("Forecast Error:", error);
    return { forecast: [] };
  }
}

export async function getHistory() {
  try {
    const res = await fetch(`${BASE_URL}/history`);

    if (!res.ok) {
      throw new Error("History fetch failed");
    }

    return await res.json();
  } catch (error) {
    console.error("History Error:", error);
    return { history: [] };
  }
}

export async function predictLevel(date) {
  try {
    const res = await fetch(
      `http://localhost:5000/api/ai/predict-level?date=${date}`
    );

    if (!res.ok) {
      throw new Error("Prediction request failed");
    }

    return await res.json();
  } catch (error) {
    console.error("Prediction Error:", error);
    return null;
  }
}

export async function getStations() {
  const res = await fetch("http://localhost:5000/api/ai/stations");
  return res.json();
}

