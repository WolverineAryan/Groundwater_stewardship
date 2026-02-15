export default function StatsCard({
  title,
  value,
  icon,
}) {

  // ===============================
  // COLOR LOGIC
  // ===============================
  const getAccent = () => {
    if (value === "Rising") return "text-green-500";
    if (value === "Falling") return "text-red-500";
    if (value === "High") return "text-red-500";
    if (value === "Moderate") return "text-yellow-500";
    return "text-[#9381FF]";
  };

  return (
    <div
      className="
      relative overflow-hidden
      rounded-2xl
      p-6
      bg-gradient-to-br
      from-white/70
      to-[#B8B8FF]/20
      backdrop-blur-xl
      border border-white/40
      shadow-lg
      hover:shadow-2xl
      hover:-translate-y-1
      transition-all duration-300
      "
    >

      {/* ================= GLOW EFFECT ================= */}
      <div className="
        absolute -top-10 -right-10
        w-32 h-32
        bg-[#9381FF]/20
        rounded-full
        blur-3xl
      "/>

      {/* ================= HEADER ================= */}
      <div className="flex justify-between items-center mb-4">

        <p className="text-sm text-gray-600 font-medium">
          {title}
        </p>

        <span className="text-xl">
          {icon}
        </span>

      </div>

      {/* ================= VALUE ================= */}
      <h2 className={`text-3xl font-bold ${getAccent()}`}>
        {value}
      </h2>

      {/* ================= SUBTEXT ================= */}
      <p className="text-xs text-gray-500 mt-2">
        AI evaluated basin condition
      </p>

    </div>
  );
}
