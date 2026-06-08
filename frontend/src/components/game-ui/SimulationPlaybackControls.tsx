import React from "react";
import { Play, Pause, RotateCcw } from "lucide-react";

interface SimulationPlaybackControlsProps {
  currentDayIndex: number;
  totalDays: number;
  isPlaying: boolean;
  speed: number;
  onPlayToggle: () => void;
  onRestart: () => void;
  onSpeedChange: (speed: number) => void;
  onSeek: (dayIndex: number) => void;
}

export default function SimulationPlaybackControls({
  currentDayIndex,
  totalDays,
  isPlaying,
  speed,
  onPlayToggle,
  onRestart,
  onSpeedChange,
  onSeek,
}: SimulationPlaybackControlsProps) {
  const speeds = [0.5, 1, 2, 5];

  return (
    <div className="w-full bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
      {/* Top row: play/pause/reset and day counter */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Playback action buttons */}
        <div className="flex items-center gap-3">
          <button
            onClick={onPlayToggle}
            className={`flex items-center justify-center p-3 rounded-xl shadow-lg active:scale-95 transition-all ${
              isPlaying
                ? "bg-amber-500 hover:bg-amber-600 text-slate-950 shadow-amber-500/10"
                : "bg-teal-500 hover:bg-teal-600 text-slate-950 shadow-teal-500/10"
            }`}
            title={isPlaying ? "Pausar" : "Iniciar"}
          >
            {isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current" />}
          </button>

          <button
            onClick={onRestart}
            className="flex items-center justify-center p-3 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl shadow-lg active:scale-95 transition-all hover:text-slate-100"
            title="Reiniciar"
          >
            <RotateCcw className="w-5 h-5" />
          </button>
        </div>

        {/* Day Counter Display */}
        <div className="text-center sm:text-right">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-widest block mb-0.5">
            Progresso da Simulação
          </span>
          <span className="text-2xl font-black text-slate-100 tracking-tight">
            Dia {currentDayIndex + 1} <span className="text-slate-600 text-lg font-medium">/ {totalDays}</span>
          </span>
        </div>

        {/* Speed Selector */}
        <div className="flex items-center bg-slate-950 border border-slate-800/80 p-1.5 rounded-xl gap-1">
          {speeds.map((s) => (
            <button
              key={s}
              onClick={() => onSpeedChange(s)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                speed === s
                  ? "bg-slate-800 text-teal-400 border border-slate-700 shadow-md"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-900/50"
              }`}
            >
              {s}x
            </button>
          ))}
        </div>
      </div>

      {/* Bottom row: Timeline Scrubbing Slider */}
      <div className="space-y-1.5">
        <input
          type="range"
          min={0}
          max={totalDays - 1}
          value={currentDayIndex}
          onChange={(e) => onSeek(Number(e.target.value))}
          className="w-full h-2 bg-slate-950 rounded-lg appearance-none cursor-pointer accent-teal-500 border border-slate-800/60 focus:outline-none"
        />
        <div className="flex justify-between text-[10px] font-medium text-slate-500 uppercase tracking-wider px-0.5">
          <span>Início (Dia 1)</span>
          <span>Fim (Dia {totalDays})</span>
        </div>
      </div>
    </div>
  );
}
