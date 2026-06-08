import React from "react";
import { DailySimulationResult } from "../../types/simulation";
import EnergyBar from "./EnergyBar";
import BurnoutBar from "./BurnoutBar";
import DayTypeBadge from "./DayTypeBadge";
import { Award, Clock, AlertTriangle, ShieldCheck } from "lucide-react";

interface ScenarioEnergyPanelProps {
  name: string;
  dailyResults: DailySimulationResult[];
  currentDayIndex: number;
}

export default function ScenarioEnergyPanel({
  name,
  dailyResults,
  currentDayIndex,
}: ScenarioEnergyPanelProps) {
  const maxDays = dailyResults.length;
  const isFinished = currentDayIndex >= maxDays;
  const activeIndex = Math.min(currentDayIndex, maxDays - 1);
  const dayData = dailyResults[activeIndex];

  if (!dayData) {
    return (
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 text-center text-slate-500 text-sm font-light">
        Nenhum resultado de simulação disponível para {name}.
      </div>
    );
  }

  return (
    <div className={`bg-slate-900/60 border rounded-3xl p-6 shadow-xl backdrop-blur-md space-y-6 transition-all duration-300 ${
      isFinished ? "border-slate-800/50 opacity-90" : "border-slate-800 hover:border-slate-700/80"
    }`}>
      {/* Header Info */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800/80 pb-4">
        <div>
          <h4 className="text-lg font-extrabold text-slate-100 tracking-tight">
            {name}
          </h4>
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mt-0.5">
            {isFinished ? `Concluído em ${maxDays} dias` : `Simulando dia ${activeIndex + 1} de ${maxDays}`}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <DayTypeBadge
            isWorkday={dayData.is_workday}
            isRestDay={dayData.is_rest_day}
            isVacation={dayData.is_vacation}
          />
          {isFinished && (
            <span className="px-2 py-1 bg-slate-800 text-slate-400 border border-slate-700 text-[10px] font-bold uppercase rounded-md tracking-wider">
              Fim
            </span>
          )}
        </div>
      </div>

      {/* Energy & Burnout Bars */}
      <div className="space-y-4">
        <EnergyBar value={dayData.energy_end} />
        <BurnoutBar value={dayData.burnout} />
      </div>

      {/* Daily Metrics Grid */}
      <div className="grid grid-cols-2 gap-4">
        {/* Gross Output */}
        <div className="bg-slate-950/40 border border-slate-800/50 rounded-2xl p-4 flex flex-col justify-between">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5 mb-2">
            <Award className="w-3.5 h-3.5 text-violet-400" />
            Prod. Bruta
          </span>
          <div>
            <span className="text-xl font-black text-slate-200">
              {dayData.gross_output.toFixed(1)}
            </span>
            <span className="text-xs text-slate-500 ml-1 font-semibold">un</span>
          </div>
        </div>

        {/* Net Output */}
        <div className="bg-slate-950/40 border border-slate-800/50 rounded-2xl p-4 flex flex-col justify-between">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5 mb-2">
            <ShieldCheck className="w-3.5 h-3.5 text-teal-400" />
            Prod. Líquida
          </span>
          <div>
            <span className="text-xl font-black text-teal-400">
              {dayData.net_output.toFixed(1)}
            </span>
            <span className="text-xs text-slate-500 ml-1 font-semibold">un</span>
          </div>
        </div>

        {/* Free Time */}
        <div className="bg-slate-950/40 border border-slate-800/50 rounded-2xl p-4 flex flex-col justify-between">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5 mb-2">
            <Clock className="w-3.5 h-3.5 text-emerald-400" />
            Tempo Livre
          </span>
          <div>
            <span className="text-xl font-black text-slate-200">
              {dayData.free_time.toFixed(1)}
            </span>
            <span className="text-xs text-slate-500 ml-1 font-semibold">h/dia</span>
          </div>
        </div>

        {/* Error Rate */}
        <div className="bg-slate-950/40 border border-slate-800/50 rounded-2xl p-4 flex flex-col justify-between">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5 mb-2">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
            Taxa de Erro
          </span>
          <div>
            <span className="text-xl font-black text-slate-200">
              {(dayData.error_rate * 100).toFixed(1)}
            </span>
            <span className="text-xs text-slate-500 ml-1 font-semibold">%</span>
          </div>
        </div>
      </div>
    </div>
  );
}
