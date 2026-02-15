export default function AIInsightCard({ data }) {

  if (!data) return null;

  // ===============================
  // RISK COLOR
  // ===============================
  const riskColor = {
    Low: "bg-green-500/20 text-green-700",
    Moderate: "bg-yellow-400/20 text-yellow-700",
    High: "bg-red-500/20 text-red-700",
  };

  const confidence =
    Math.round((data.confidence || 0.75) * 100);

  // ===============================
  // SIMPLE AI RECOMMENDATIONS
  // ===============================
  const getActions = () => {
    if (data.risk === "High")
      return [
        "Reduce groundwater extraction",
        "Initiate artificial recharge programs",
        "Promote water conservation awareness",
      ];

    if (data.risk === "Moderate")
      return [
        "Monitor groundwater levels weekly",
        "Encourage rainwater harvesting",
      ];

    return [
      "Maintain sustainable water usage",
      "Continue recharge monitoring",
    ];
  };

  const actions = getActions();

  return (
    <div
      className="
      relative overflow-hidden
      rounded-2xl
      p-6
      text-white
      bg-gradient-to-br
      from-[#9381FF]
      to-[#B8B8FF]
      shadow-xl
      "
    >

      {/* AI Glow Background */}
      <div className="
        absolute inset-0
        bg-white/10
        backdrop-blur-sm
      "/>

      {/* ================= HEADER ================= */}
      <div className="relative flex justify-between items-center mb-4">

        <h2 className="font-semibold text-lg flex items-center gap-2">
          🤖 AI Basin Intelligence
        </h2>

        {/* LIVE AI DOT */}
        <span className="relative flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-white"></span>
        </span>

      </div>

      {/* ================= INSIGHT TEXT ================= */}
      <p className="relative text-sm leading-relaxed mb-6">
        {data.insight || data.story}
      </p>

      {/* ================= METRICS ================= */}
      <div className="relative flex flex-wrap gap-4 mb-6">

        <span className="
          px-4 py-1 rounded-full
          bg-white/20 text-white text-sm
        ">
          Trend: {data.trend}
        </span>

        <span
          className={`
            px-4 py-1 rounded-full text-sm
            ${riskColor[data.risk]}
          `}
        >
          Risk: {data.risk}
        </span>

        <span className="
          px-4 py-1 rounded-full
          bg-white/20 text-white text-sm
        ">
          Confidence: {confidence}%
        </span>

      </div>

      {/* ================= ACTIONS ================= */}
      <div className="relative">

        <h3 className="font-medium mb-2">
          Recommended Actions
        </h3>

        <ul className="space-y-1 text-sm">
          {actions.map((a, i) => (
            <li key={i} className="flex gap-2">
              <span>•</span>
              <span>{a}</span>
            </li>
          ))}
        </ul>

      </div>

    </div>
  );
}
