import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

export default function GroundwaterChart({ data = [] }) {

  // ===============================
  // SAFETY CHECK
  // ===============================
  if (!data || data.length === 0) {
    return (
      <div className="bg-white p-6 rounded-xl shadow">
        No groundwater data available
      </div>
    );
  }

  // ===============================
  // DYNAMIC AXIS CALCULATION
  // ===============================
  const values = data.map(d => Number(d.groundwater));

  const minY = Math.min(...values);
  const maxY = Math.max(...values);

  // padding prevents chart touching edges
  const padding = (maxY - minY) * 0.1 || 1;

  const yDomain = [
    Math.floor(minY - padding),
    Math.ceil(maxY + padding),
  ];

  // ===============================
  // DATE FORMATTER
  // ===============================
  const formatDate = (date) => {
    const d = new Date(date);
    return `${d.getDate()}/${d.getMonth() + 1}`;
  };

  // ===============================
  // TOOLTIP FORMATTER
  // ===============================
  const tooltipFormatter = (value) => [
    `${value.toFixed(2)} m`,
    "Groundwater Level",
  ];

  return (
    <div className="bg-white p-6 rounded-2xl shadow-md">

      <h3 className="font-semibold mb-4 text-gray-700">
        💧 Groundwater Level Trend
      </h3>

      <ResponsiveContainer width="100%" height={320}>
        <LineChart
          data={data}
          margin={{ top: 10, right: 20, left: 0, bottom: 5 }}
        >
          {/* GRID */}
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />

          {/* X AXIS */}
          <XAxis
            dataKey="date"
            tickFormatter={formatDate}
            interval="preserveStartEnd"
            tick={{ fontSize: 12 }}
          />

          {/* Y AXIS (AUTO RESCALE) */}
          <YAxis
            domain={yDomain}
            tick={{ fontSize: 12 }}
            label={{
              value: "Meters",
              angle: -90,
              position: "insideLeft",
            }}
          />

          {/* TOOLTIP */}
          <Tooltip formatter={tooltipFormatter} />

          {/* LINE */}
          <Line
            type="monotone"
            dataKey="groundwater"
            stroke="#2563eb"
            strokeWidth={3}
            dot={false}
            animationDuration={600}
            isAnimationActive={true}
          />
        </LineChart>
      </ResponsiveContainer>

    </div>
  );
}
