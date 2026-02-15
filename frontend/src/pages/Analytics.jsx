import { useEffect, useState, useMemo } from "react";

import Navbar from "../components/Navbar";
import TimelineScrubber from "../components/TimelineScrubber";

import RainfallChart from "../components/analytics/RainfallChart";
import GroundwaterChart from "../components/analytics/GroundwaterChart";
import RechargeChart from "../components/analytics/RechargeChart";
import RelationChart from "../components/analytics/RelationChart";
import PredictionCard from "../components/analytics/PredictionCard";

import { getHistory, getForecast } from "../api/ai";

export default function Analytics() {

  const [data, setData] = useState([]);
  const [selectedDate, setSelectedDate] = useState("");
  const [loading, setLoading] = useState(true);

  // ====================================
  // LOAD HISTORY + FORECAST
  // ====================================
  useEffect(() => {

    async function loadAll() {

      try {
        const historyRes = await getHistory();
        const forecastRes = await getForecast(30);

        const history = historyRes?.history || [];
        const forecast = forecastRes?.forecast || [];

        // ---------- HISTORY ----------
        const historyData = history.map((d, i) => ({
          date: d.date,
          groundwater: d.groundwater,
          rainfall: Math.max(0, 20 + Math.sin(i / 12) * 10),
          recharge: d.groundwater * 0.12,
          type: "history",
        }));

        // ---------- FORECAST ----------
        const lastDate = new Date(
          historyData[historyData.length - 1].date
        );

        const forecastData = forecast.map((value, i) => {

          const futureDate = new Date(lastDate);
          futureDate.setDate(lastDate.getDate() + i + 1);

          return {
            date: futureDate.toISOString().slice(0, 10),
            groundwater: value,
            rainfall: null,
            recharge: value * 0.12,
            type: "forecast",
          };
        });

        const combined = [...historyData, ...forecastData];

        setData(combined);
        setSelectedDate(combined[historyData.length - 1].date);

      } catch (err) {
        console.error(err);
      }

      setLoading(false);
    }

    loadAll();

  }, []);

  // ====================================
  // FILTER BY TIMELINE POSITION
  // ====================================
  const filteredData = useMemo(() => {

    if (!selectedDate) return data;

    return data.filter(d => d.date <= selectedDate);

  }, [data, selectedDate]);

  // ====================================
  // UI
  // ====================================
  return (
    <div className="min-h-screen bg-[#F8F7FF]">

      <Navbar />

      <div className="max-w-7xl mx-auto p-6 space-y-6">

        <h1 className="text-2xl font-bold text-[#2b2b55]">
          Groundwater Analytics Simulator
        </h1>

        {/* TIMELINE */}
        <TimelineScrubber
          data={data}
          selectedDate={selectedDate}
          onChange={setSelectedDate}
        />

        {loading ? (
          <div className="card">Loading analytics...</div>
        ) : (
          <>
            <div className="grid md:grid-cols-2 gap-6">
              <GroundwaterChart data={filteredData} />
              <RainfallChart data={filteredData} />
            </div>

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
