import React from "react";

interface EnergyBarProps {
  value: number;
}

export default function EnergyBar({ value }: EnergyBarProps) {
  const percentage = Math.min(100, Math.max(0, value));

  // Dynamic bar colors based on energy level
  let barColor = "from-emerald-500 to-teal-400 shadow-teal-500/20";
  if (percentage < 30) {
    barColor = "from-red-600 to-orange-500 shadow-red-500/20";
  } else if (percentage < 60) {
    barColor = "from-amber-500 to-yellow-400 shadow-amber-500/20";
  }

  return (
    <div className="w-full bg-slate-900 border border-slate-800 rounded-lg p-4 shadow-lg shadow-black/30">
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-sm font-semibold tracking-wide text-slate-300 uppercase">
          🔋 Energia Vital
        </span>
        <span className="text-sm font-bold text-teal-400">{percentage.toFixed(1)}%</span>
      </div>
      <div className="h-5 w-full bg-slate-950 rounded-md overflow-hidden p-[2px] border border-slate-800/80">
        <div
          className={`h-full rounded-sm bg-gradient-to-r ${barColor} shadow-[0_0_10px_rgba(20,184,166,0.2)] transition-all duration-150 ease-out`}
          style={{ width: `${percentage}%` }}
        />
      </div>
      <p className="text-[11px] text-slate-500 mt-1.5 font-light">
        Representa a capacidade física e mental de curto prazo do trabalhador.
      </p>
    </div>
  );
}
