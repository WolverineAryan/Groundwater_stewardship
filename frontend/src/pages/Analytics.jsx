import { useEffect, useState, useMemo } from "react";

import Navbar from "../components/Navbar";

import RainfallChart from "../components/analytics/RainfallChart";
import GroundwaterChart from "../components/analytics/GroundwaterChart";
import RechargeChart from "../components/analytics/RechargeChart";
import RelationChart from "../components/analytics/RelationChart";
import PredictionCard from "../components/analytics/PredictionCard";

import { getHistory } from "../api/ai";

export default function Analytics() {

  const [data, setData] = useState([]);
  const [selectedDate, setSelectedDate] = useState("");
  const [loading, setLoading] = useState(true);

  // ===============================
  // LOAD DATA
  // ===============================
  useEffect(() => {
    async function loadData() {
      const res = await getHistory();

      const history = res?.history || [];

      const enriched = history.map((d, i) => ({
        date: d.date,
        groundwater: d.groundwater,
        rainfall: Math.max(0, 20 + Math.sin(i / 12) * 10),
        recharge: d.groundwater * 0.12,
      }));

      setData(enriched);

      // default latest date
      if (enriched.length)
        setSelectedDate(enriched[enriched.length - 1].date);

      setLoading(false);
    }

    loadData();
  }, []);

  // ===============================
  // FILTER DATA BY DATE
  // ===============================
  const filteredData = useMemo(() => {
    if (!selectedDate) return data;

    return data.filter(d => d.date <= selectedDate);
  }, [data, selectedDate]);

  return (
    <div className="bg-gray-100 min-h-screen">

      <Navbar />

      <div className="p-6 space-y-6">

        <h1 className="text-2xl font-bold">
          Groundwater Analytics
        </h1>

        {/* ================= DATE SELECTOR ================= */}
        <div className="bg-white p-4 rounded-xl shadow flex gap-4 items-center">

          <label className="font-medium">
            Select Analysis Date:
          </label>

          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="border rounded px-3 py-2"
          />

        </div>

        {loading ? (
          <div className="bg-white p-6 rounded-xl shadow">
            Loading analytics data...
          </div>
        ) : (
          <>
            {/* ROW 1 */}
            <div className="grid md:grid-cols-2 gap-6">
              <GroundwaterChart data={filteredData} />
              <RainfallChart data={filteredData} />
            </div>

            {/* ROW 2 */}
            <div className="grid md:grid-cols-2 gap-6">
              <RelationChart data={filteredData} />
              <RechargeChart data={filteredData} />
            </div>

            <PredictionCard selectedDate={selectedDate} />
          </>
        )}

      </div>
    </div>
  );
}
