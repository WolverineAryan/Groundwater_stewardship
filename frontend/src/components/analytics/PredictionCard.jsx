import { useState } from "react";
import { predictLevel } from "../../api/ai";

export default function PredictionCard() {
  const [date, setDate] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handlePredict = async () => {
    if (!date) return;

    const res = await predictLevel(date);

    if (res.error) {
      alert(res.error);
      return;
    }

    setResult(res);

    setLoading(true);
    setLoading(false);
  };

  const trendColor =
    result?.trend === "Rising" ? "text-green-600" : "text-red-600";

  return (
    <div className="bg-white p-6 rounded-2xl shadow space-y-4">
      <h3 className="font-semibold text-lg">🔮 AI Groundwater Prediction</h3>

      <input
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        className="border p-2 rounded w-full"
      />

      <button
        onClick={handlePredict}
        className="bg-blue-600 text-white px-4 py-2 rounded w-full"
      >
        {loading ? "Predicting..." : "Predict Level"}
      </button>

      {result && (
        <div className="bg-gray-50 rounded-xl p-4 space-y-2">
          <p className="text-xl font-bold text-blue-600">
            {result.predicted_level} meters
          </p>

          <p className={trendColor}>
            Trend: {result.trend === "Rising" ? "⬆ Rising" : "⬇ Falling"}
          </p>

          <p className="text-gray-600">
            Confidence: {(result.confidence * 100).toFixed(0)}%
          </p>

          <p className="text-sm text-gray-500">
            Prediction Date: {result.date}
          </p>
        </div>
      )}
    </div>
  );
}
