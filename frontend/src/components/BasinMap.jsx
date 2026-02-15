import {
  MapContainer,
  TileLayer,
  CircleMarker,
  Popup
} from "react-leaflet";

const stations = [
  { name: "Nashik Central", pos: [19.9975, 73.7898] },
  { name: "Igatpuri", pos: [19.695, 73.562] },
  { name: "Sinnar", pos: [19.85, 74.0] },
  { name: "Niphad", pos: [20.08, 74.12] },
];

export default function BasinMap({ aiData }) {
  if (!aiData) return null;

  const getColor = () => {
    if (aiData.health_score > 70) return "#22c55e";
    if (aiData.health_score > 40) return "#f59e0b";
    return "#ef4444";
  };

  const color = getColor();

  return (
    <div className="bg-white rounded-2xl shadow-md p-4">
      <h2 className="text-lg font-semibold mb-3">
        🌍 Nashik Groundwater Basin Status
      </h2>

      <MapContainer
        center={[19.99, 73.78]}
        zoom={10}
        style={{ height: "420px", width: "100%" }}
      >
        <TileLayer
          attribution="OpenStreetMap"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {stations.map((s, i) => (
          <CircleMarker
            key={i}
            center={s.pos}
            radius={18}
            pathOptions={{
              color,
              fillColor: color,
              fillOpacity: 0.6,
            }}
          >
            <Popup>
              <strong>{s.name}</strong>
              <br />
              Health Score: {aiData.health_score}/100
              <br />
              Trend: {aiData.trend}
              <br />
              Risk: {aiData.risk}
            </Popup>
          </CircleMarker>
        ))}
      </MapContainer>
    </div>
  );
}
