import { useEffect, useState } from "react";

export default function TimeSlider({ history, onChange }) {
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(false);

  // playback animation
  useEffect(() => {
    if (!playing) return;

    const interval = setInterval(() => {
      setIndex(prev => {
        const next = (prev + 1) % history.length;
        onChange(history[next]);
        return next;
      });
    }, 800);

    return () => clearInterval(interval);
  }, [playing, history, onChange]);

  const handleSlide = e => {
    const i = Number(e.target.value);
    setIndex(i);
    onChange(history[i]);
  };

  return (
    <div className="bg-white rounded-2xl shadow-md p-4 space-y-3">
      <h3 className="font-semibold">📅 Time Playback</h3>

      <input
        type="range"
        min="0"
        max={history.length - 1}
        value={index}
        onChange={handleSlide}
        className="w-full"
      />

      <div className="flex justify-between items-center">
        <span>{history[index]?.date}</span>

        <button
          onClick={() => setPlaying(!playing)}
          className="px-3 py-1 bg-blue-500 text-white rounded-lg"
        >
          {playing ? "Pause" : "Play"}
        </button>
      </div>
    </div>
  );
}
