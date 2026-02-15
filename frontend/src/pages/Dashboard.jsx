import { useEffect, useState } from "react";

import Navbar from "../components/Navbar";
import AIInsightCard from "../components/AIInsightCard";
import HealthGauge from "../components/HealthGauge";
import StatsCard from "../components/StatsCard";
import BasinBubbleMap from "../components/BasicBubbleMap";
import AmbientBackground from "../components/AmbientBackground";
import AIStoryOverlay from "../components/AIStoryOverlay";

import { getAIPrediction } from "../api/ai";

export default function Dashboard() {

  // ===============================
  // STATE
  // ===============================
  const [aiData, setAiData] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [storyOpen, setStoryOpen] = useState(false);

  // ===============================
  // LIVE AI AUTO REFRESH
  // ===============================
  useEffect(() => {

    const fetchAI = async () => {
      try {
        const data = await getAIPrediction();
        setAiData(data);
        setLastUpdated(new Date());
      } catch (err) {
        console.error("AI fetch failed:", err);
      }
    };

    fetchAI();

    const interval = setInterval(fetchAI, 30000);

    return () => clearInterval(interval);

  }, []);

  // ===============================
  // UI
  // ===============================
  return (
    <div className="min-h-screen relative text-gray-800">

      {/* 🌊 Adaptive Ambient Background */}
      <AmbientBackground
        score={aiData?.health_score || 70}
      />

      {/* ================= NAVBAR ================= */}
      <Navbar />

      {/* ================= AI LIVE STATUS ================= */}
      <div className="flex justify-end px-6 pt-4">
        <div className="flex items-center gap-2 text-sm text-gray-600">

          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#9381FF] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-[#9381FF]"></span>
          </span>

          AI Monitoring Active
        </div>
      </div>
        <div className="flex justify-end px-6 mt-2">
  <button
    onClick={() => setStoryOpen(true)}
    className="
      bg-[#9381FF]
      text-white
      px-5 py-2
      rounded-full
      shadow-lg
      hover:scale-105
      transition
    "
  >
    ▶ Story Mode
  </button>
</div>

      {/* ================= MAIN CONTENT ================= */}
      <main className="max-w-7xl mx-auto p-6 space-y-6">

        {/* ===== STATS ===== */}
        {aiData && (
          <div className="grid lg:grid-cols-3 gap-6">

            <div className="card hover-lift">
              <HealthGauge score={aiData.health_score} />
            </div>

            <div className="card hover-lift">
              <StatsCard
                title="Groundwater Trend"
                value={aiData.trend}
                icon={aiData.trend === "Rising" ? "🟢" : "🔴"}
              />
            </div>

            <div className="card hover-lift">
              <StatsCard
                title="Risk Level"
                value={aiData.risk}
                icon="⚠️"
              />
            </div>

          </div>
        )}

        {/* ===== LAST UPDATED ===== */}
        {lastUpdated && (
          <p className="text-sm text-gray-500">
            Updated {lastUpdated.toLocaleTimeString()}
          </p>
        )}

        {/* ===== AI INSIGHT PANEL ===== */}
        <div className="card hover-lift">
          <AIInsightCard data={aiData} />
        </div>

        {/* ===== BASIN MAP ===== */}
        <div className="card hover-lift">
          <BasinBubbleMap aiData={aiData} />
        </div>

      </main>

{storyOpen && (
  <AIStoryOverlay
    data={aiData}
    onClose={() => setStoryOpen(false)}
  />
)}

    </div>
  );
}
