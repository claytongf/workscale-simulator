import React from "react";

interface ProductivityBarProps {
  value: number; // e.g. worker productivity factor or efficiency percentage
  max?: number;
}

export default function ProductivityBar({ value, max = 100 }: ProductivityBarProps) {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100));

  return (
    <div className="w-full bg-slate-900 border border-slate-800 rounded-lg p-4 shadow-lg shadow-black/30">
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-sm font-semibold tracking-wide text-slate-300 uppercase">
          ⚡ Eficiência Produtiva
        </span>
        <span className="text-sm font-bold text-violet-400">{percentage.toFixed(1)}%</span>
      </div>
      <div className="h-5 w-full bg-slate-950 rounded-md overflow-hidden p-[2px] border border-slate-800/80">
        <div
          className="h-full rounded-sm bg-gradient-to-r from-violet-600 to-purple-500 shadow-purple-500/20 transition-all duration-500 ease-out"
          style={{ width: `${percentage}%` }}
        />
      </div>
      <p className="text-[11px] text-slate-500 mt-1.5 font-light">
        Aproveitamento das horas de trabalho com base na energia e experiência do trabalhador.
      </p>
    </div>
  );
}
