import {
  MapContainer,
  TileLayer,
  CircleMarker,
  Popup,
} from "react-leaflet";

import { useEffect, useState } from "react";
import { getStations } from "../api/ai";

export default function BasinBubbleMap() {

  const [stations, setStations] = useState([]);
  const [selected, setSelected] = useState("ALL");

  // ==========================
  // Load stations
  // ==========================
  useEffect(() => {
    getStations().then((res) => {
      setStations(res.stations || []);
    });
  }, []);

  if (!stations.length) return null;

  // ==========================
  // Filter
  // ==========================
  const filteredStations =
    selected === "ALL"
      ? stations
      : stations.filter((s) => s.name === selected);

  // ==========================
  // Risk logic per station
  // ==========================
  const getRiskColor = (level) => {
    if (level > 13) return "#22c55e"; // green
    if (level > 11) return "#f59e0b"; // yellow
    return "#ef4444"; // red
  };

  const getRadius = (level) => {
    return Math.max(8, level * 1.8);
  };

  return (
    <div className="bg-white rounded-2xl shadow-md p-6 space-y-4">

      {/* HEADER */}
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">
          🌍 Nashik Groundwater Map
        </h2>

        <select
          value={selected}
          onChange={(e) => setSelected(e.target.value)}
          className="border rounded px-3 py-2"
        >
          <option value="ALL">All Stations</option>

          {stations.map((s) => (
            <option key={s.name}>{s.name}</option>
          ))}
        </select>
      </div>

      {/* REAL MAP */}
      <MapContainer
        center={[19.99, 73.78]}
        zoom={10}
        scrollWheelZoom={true}
        style={{ height: "450px", width: "100%" }}
      >
        <TileLayer
          attribution="OpenStreetMap"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {filteredStations.map((station) => (
          <CircleMarker
            key={station.name}
            center={[station.lat, station.lon]}
            radius={getRadius(station.level)}
            pathOptions={{
              color: "#1f2937",
              fillColor: getRiskColor(station.level),
              fillOpacity: 0.7,
            }}
          >
            <Popup>
              <div className="space-y-1">
                <strong>{station.name}</strong>
                <br />
                Level: {station.level} m
                <br />
                Risk:
                {station.level > 13
                  ? " Healthy"
                  : station.level > 11
                  ? " Moderate"
                  : " Critical"}
              </div>
            </Popup>
          </CircleMarker>
        ))}
      </MapContainer>

      {/* LEGEND */}
      <div className="flex gap-6 text-sm">
        <span className="flex items-center gap-2">
          <span className="w-3 h-3 bg-green-500 rounded-full"></span>
          Healthy
        </span>

        <span className="flex items-center gap-2">
          <span className="w-3 h-3 bg-yellow-500 rounded-full"></span>
          Moderate
        </span>

        <span className="flex items-center gap-2">
          <span className="w-3 h-3 bg-red-500 rounded-full"></span>
          Critical
        </span>
      </div>
    </div>
  );
}
