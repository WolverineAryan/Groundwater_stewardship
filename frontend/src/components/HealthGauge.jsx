import GaugeComponent from "react-gauge-component";

export default function HealthGauge({ score = 0 }) {

  // ===============================
  // HEALTH STATUS
  // ===============================
  const getLabel = () => {
    if (score > 70) return "Healthy";
    if (score > 40) return "Moderate";
    return "Critical";
  };

  return (
    <div
      className="
      relative
      rounded-2xl
      p-6
      bg-gradient-to-br
      from-white/70
      to-[#B8B8FF]/20
      backdrop-blur-xl
      border border-white/40
      shadow-lg
      hover:shadow-2xl
      transition-all duration-300
      "
    >

      {/* Glow background */}
      <div className="
        absolute inset-0
        bg-[#9381FF]/10
        blur-3xl
        rounded-2xl
      "/>

      <h3 className="relative text-sm text-gray-600 mb-4 font-medium">
        Groundwater Health Index
      </h3>

      {/* ================= GAUGE ================= */}
      <div className="relative">

        <GaugeComponent
          value={score}
          type="radial"
          arc={{
            width: 0.25,
            padding: 0.02,
            gradient: true,
            subArcs: [
              { limit: 40, color: "#ef4444" }, // red
              { limit: 70, color: "#f59e0b" }, // amber
              { color: "#9381FF" }, // primary
            ],
          }}
          pointer={{
            elastic: true,
            animationDelay: 0,
          }}
          labels={{
            valueLabel: {
              style: {
                fontSize: "38px",
                fill: "#9381FF",
                fontWeight: "bold",
              },
              formatTextValue: () => `${score}`,
            },
            tickLabels: {
              hideMinMax: true,
            },
          }}
        />

        {/* CENTER LABEL */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">

          <p className="text-xs text-gray-500 mt-10">
            {getLabel()}
          </p>

        </div>

      </div>

    </div>
  );
}
