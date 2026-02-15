import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  ZAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

export default function BasinAnalyticsMap({
  stations,
  aiData,
}) {
  if (!stations.length || !aiData) return null;

  const getColor = () => {
    if (aiData.health_score > 70) return "#22c55e";
    if (aiData.health_score > 40) return "#f59e0b";
    return "#ef4444";
  };

  return (
    <div className="bg-white rounded-2xl shadow-md p-6">

      <h2 className="text-lg font-semibold mb-4">
        📊 Basin Monitoring Network
      </h2>

      <ResponsiveContainer width="100%" height={420}>
        <ScatterChart>
          <CartesianGrid strokeDasharray="3 3" />

          <XAxis type="number" dataKey="lon" name="Longitude" />
          <YAxis type="number" dataKey="lat" name="Latitude" />

          <ZAxis
            type="number"
            dataKey="level"
            range={[80, 500]}
          />

          <Tooltip
            formatter={(value, key) =>
              key === "level"
                ? [`${value} m`, "Groundwater Level"]
                : value
            }
          />

          <Scatter
            data={stations}
            fill={getColor()}
          />
        </ScatterChart>
      </ResponsiveContainer>

    </div>
  );
}
