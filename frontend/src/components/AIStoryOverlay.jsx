import { useEffect, useState } from "react";

export default function AIStoryOverlay({ data, onClose }) {

  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setTimeout(() => setVisible(true), 50);
  }, []);

  if (!data) return null;

  const story =
    data.story ||
    "Groundwater conditions are being analyzed by the AI system.";

  return (
    <div className="
      fixed inset-0 z-50
      flex items-center justify-center
      bg-black/40 backdrop-blur-md
    ">

      {/* PANEL */}
      <div
        className={`
        relative w-[90%] max-w-2xl
        rounded-3xl
        p-8
        text-white
        bg-gradient-to-br
        from-[#9381FF]
        to-[#B8B8FF]
        shadow-2xl
        transform transition-all duration-500
        ${visible ? "scale-100 opacity-100" : "scale-90 opacity-0"}
        `}
      >

        {/* CLOSE BUTTON */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white/80 hover:text-white"
        >
          ✕
        </button>

        {/* HEADER */}
        <h2 className="text-2xl font-semibold mb-4">
          🧠 AI Basin Story Mode
        </h2>

        {/* STORY TEXT */}
        <p className="leading-relaxed text-white/95 mb-6">
          {story}
        </p>

        {/* METRICS */}
        <div className="flex gap-4 flex-wrap">

          <span className="bg-white/20 px-4 py-2 rounded-full">
            Trend: {data.trend}
          </span>

          <span className="bg-white/20 px-4 py-2 rounded-full">
            Risk: {data.risk}
          </span>

          <span className="bg-white/20 px-4 py-2 rounded-full">
            Health Score: {data.health_score}
          </span>

        </div>

      </div>
    </div>
  );
}
