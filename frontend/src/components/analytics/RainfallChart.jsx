import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function RainfallChart({ data = [] }) {

  if (!data.length) return null;

  // ✅ compute BEFORE return
  const minY = Math.min(...data.map(d => d.rainfall));
  const maxY = Math.max(...data.map(d => d.rainfall));

  return (
    <div className="bg-white p-6 rounded-xl shadow">

      <h3 className="font-semibold mb-4">
        Rainfall Pattern
      </h3>

      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <XAxis dataKey="date" />
          <YAxis domain={[minY - 5, maxY + 5]} />
          <Tooltip />

          <Bar
            dataKey="rainfall"
            fill="#22c55e"
          />
        </BarChart>
      </ResponsiveContainer>

    </div>
  );
}
