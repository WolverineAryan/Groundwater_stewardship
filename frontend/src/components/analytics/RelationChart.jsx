import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function RelationChart({ data = [] }) {

  if (!data.length) return null;

  const minX = Math.min(...data.map(d => d.rainfall));
  const maxX = Math.max(...data.map(d => d.rainfall));

  const minY = Math.min(...data.map(d => d.groundwater));
  const maxY = Math.max(...data.map(d => d.groundwater));

  return (
    <div className="bg-white p-6 rounded-xl shadow">

      <h3 className="font-semibold mb-4">
        Rainfall vs Groundwater Relation
      </h3>

      <ResponsiveContainer width="100%" height={300}>
        <ScatterChart>

          <XAxis
            dataKey="rainfall"
            name="Rainfall"
            domain={[minX - 5, maxX + 5]}
          />

          <YAxis
            dataKey="groundwater"
            name="Groundwater"
            domain={[minY - 0.5, maxY + 0.5]}
          />

          <Tooltip />

          <Scatter data={data} fill="#f97316" />

        </ScatterChart>
      </ResponsiveContainer>

    </div>
  );
}
