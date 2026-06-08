import React from "react";

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  color?: "teal" | "emerald" | "indigo" | "amber" | "rose" | "purple" | "slate";
}

export default function StatCard({ title, value, subtitle, color = "slate" }: StatCardProps) {
  const borderColors = {
    teal: "border-teal-500/20 hover:border-teal-500/40",
    emerald: "border-emerald-500/20 hover:border-emerald-500/40",
    indigo: "border-indigo-500/20 hover:border-indigo-500/40",
    amber: "border-amber-500/20 hover:border-amber-500/40",
    rose: "border-rose-500/20 hover:border-rose-500/40",
    purple: "border-purple-500/20 hover:border-purple-500/40",
    slate: "border-slate-800/80 hover:border-slate-700/80",
  };

  const textColors = {
    teal: "text-teal-400",
    emerald: "text-emerald-400",
    indigo: "text-indigo-400",
    amber: "text-amber-400",
    rose: "text-rose-400",
    purple: "text-purple-400",
    slate: "text-slate-300",
  };

  return (
    <div className={`bg-slate-900 border ${borderColors[color]} p-5 rounded-2xl transition-all duration-300 hover:shadow-lg hover:shadow-black/25 flex flex-col justify-between min-h-[120px]`}>
      <div>
        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
          {title}
        </p>
        <p className={`text-2xl font-bold tracking-tight ${textColors[color]}`}>
          {value}
        </p>
      </div>
      {subtitle && <p className="text-xs text-slate-400 mt-2 font-light">{subtitle}</p>}
    </div>
  );
}
