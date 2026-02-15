export default function StationFilter({
  stations,
  selected,
  onChange,
}) {
  return (
    <div className="bg-white p-4 rounded-xl shadow">
      <label className="font-medium mr-3">
        Select Station:
      </label>

      <select
        value={selected}
        onChange={(e) => onChange(e.target.value)}
        className="border rounded px-3 py-2"
      >
        <option value="ALL">All Stations</option>

        {stations.map((s) => (
          <option key={s.name} value={s.name}>
            {s.name}
          </option>
        ))}
      </select>
    </div>
  );
}
