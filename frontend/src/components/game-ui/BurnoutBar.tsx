import React from "react";

interface BurnoutBarProps {
  value: number;
}

export default function BurnoutBar({ value }: BurnoutBarProps) {
  const percentage = Math.min(100, Math.max(0, value));

  // Dynamic bar colors based on burnout level (danger increases as value goes up)
  let barColor = "from-teal-600 to-indigo-500 shadow-indigo-500/20";
  if (percentage > 70) {
    barColor = "from-red-600 to-rose-500 shadow-red-500/20 animate-pulse";
  } else if (percentage > 40) {
    barColor = "from-amber-600 to-orange-500 shadow-orange-500/20";
  }

  return (
    <div className="w-full bg-slate-900 border border-slate-800 rounded-lg p-4 shadow-lg shadow-black/30">
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-sm font-semibold tracking-wide text-slate-300 uppercase">
          🔥 Nível de Burnout
        </span>
        <span className="text-sm font-bold text-indigo-400">{percentage.toFixed(1)}%</span>
      </div>
      <div className="h-5 w-full bg-slate-950 rounded-md overflow-hidden p-[2px] border border-slate-800/80">
        <div
          className={`h-full rounded-sm bg-gradient-to-r ${barColor} transition-all duration-150 ease-out`}
          style={{ width: `${percentage}%` }}
        />
      </div>
      <p className="text-[11px] text-slate-500 mt-1.5 font-light">
        Exaustão crônica acumulada. Altas taxas causam queda de produtividade e erros.
      </p>
    </div>
  );
}
