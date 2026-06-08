import React from "react";
import { Briefcase, Coffee, Sun, Minus } from "lucide-react";

interface DayTypeBadgeProps {
  isWorkday: boolean;
  isRestDay: boolean;
  isVacation: boolean;
}

export default function DayTypeBadge({ isWorkday, isRestDay, isVacation }: DayTypeBadgeProps) {
  if (isVacation) {
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
        <Sun className="w-3.5 h-3.5" />
        <span>Vacation day</span>
      </span>
    );
  }

  if (isRestDay) {
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
        <Coffee className="w-3.5 h-3.5" />
        <span>Rest day</span>
      </span>
    );
  }

  if (isWorkday) {
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-teal-500/10 text-teal-400 border border-teal-500/20">
        <Briefcase className="w-3.5 h-3.5" />
        <span>Workday</span>
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-slate-500/10 text-slate-400 border border-slate-500/20">
      <Minus className="w-3.5 h-3.5" />
      <span>Unclassified</span>
    </span>
  );
}
