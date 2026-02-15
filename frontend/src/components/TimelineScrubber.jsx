import { useState, useEffect, useMemo, useRef } from "react";

export default function TimelineScrubber({
  data = [],
  selectedDate,
  onChange,
}) {

  // ===============================
  // HOOKS (ALWAYS FIRST)
  // ===============================
  const [playing, setPlaying] = useState(false);
  const intervalRef = useRef(null);

  // memoized dates
  const dates = useMemo(() => {
    return data.map(d => d.date);
  }, [data]);

  // ===============================
  // AUTOPLAY EFFECT
  // ===============================
  useEffect(() => {

    if (!playing || dates.length === 0) return;

    intervalRef.current = setInterval(() => {

      const currentIndex = dates.indexOf(selectedDate);

      if (currentIndex < dates.length - 1) {
        onChange(dates[currentIndex + 1]);
      } else {
        setPlaying(false);
      }

    }, 800);

    return () => clearInterval(intervalRef.current);

  }, [playing, selectedDate, dates, onChange]);

  // ===============================
  // SAFE RENDER GUARD (AFTER HOOKS)
  // ===============================
  if (!data.length) {
    return (
      <div className="card text-sm text-gray-500">
        Preparing timeline...
      </div>
    );
  }

  const currentIndex = dates.indexOf(selectedDate);

  // ===============================
  // UI
  // ===============================
  return (
    <div className="card space-y-4">

      {/* CONTROLS */}
      <div className="flex items-center gap-4">

        <button
          onClick={() => setPlaying(!playing)}
          className="
            px-4 py-2 rounded-lg
            bg-[#9381FF] text-white
            hover:brightness-110
            transition
          "
        >
          {playing ? "⏸ Pause" : "▶ Play"}
        </button>

        <span className="text-sm text-gray-600">
          {selectedDate}
        </span>

      </div>

      {/* SLIDER */}
      <input
        type="range"
        min={0}
        max={dates.length - 1}
        value={currentIndex}
        onChange={(e) =>
          onChange(dates[Number(e.target.value)])
        }
        className="w-full accent-[#9381FF]"
      />

    </div>
  );
}
