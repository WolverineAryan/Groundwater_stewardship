import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function RechargeChart({ data = [] }) {

  if (!data.length) return null;

  const minY = Math.min(...data.map(d => d.recharge));
  const maxY = Math.max(...data.map(d => d.recharge));

  return (
    <div className="bg-white p-6 rounded-xl shadow">

      <h3 className="font-semibold mb-4">
        Recharge Estimation
      </h3>

      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={data}>
          <XAxis dataKey="date" />
          <YAxis domain={[minY * 0.9, maxY * 1.1]} />
          <Tooltip />

          <Area
            type="monotone"
            dataKey="recharge"
            fill="#60a5fa"
            stroke="#2563eb"
          />
        </AreaChart>
      </ResponsiveContainer>

    </div>
  );
}
