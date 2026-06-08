import React from "react";
import { CompareSimulationsResult, MetricDelta } from "../../types/simulation";

interface ScenarioComparisonTableProps {
  comparisonResult: CompareSimulationsResult;
}

const METRIC_CONFIG: Record<string, { label: string; unit: string; precision: number }> = {
  average_energy: { label: "🔋 Energia Média", unit: "%", precision: 1 },
  final_energy: { label: "🔋 Energia Final", unit: "%", precision: 1 },
  burnout: { label: "🔥 Burnout Final", unit: "%", precision: 1 },
  gross_output: { label: "📦 Produção Bruta", unit: " un", precision: 0 },
  net_output: { label: "📊 Produção Líquida", unit: " un", precision: 0 },
};

export default function ScenarioComparisonTable({ comparisonResult }: ScenarioComparisonTableProps) {
  const { baseline_scenario_name, scenarios, deltas } = comparisonResult;

  // Helper to format values safely
  const formatVal = (val: number | null | undefined, precision: number, unit: string) => {
    if (val === null || val === undefined) return "N/A";
    return `${val.toFixed(precision)}${unit}`;
  };

  // Helper to get delta for a specific scenario and metric
  const getDelta = (scenarioName: string, metricKey: string): MetricDelta | undefined => {
    const scenarioDelta = deltas.find((d) => d.scenario_name === scenarioName);
    return scenarioDelta?.deltas.find((m) => m.metric === metricKey);
  };

  // Helper to render delta indicators in a neutral style
  const renderDelta = (delta: MetricDelta | undefined, precision: number, unit: string) => {
    if (!delta || delta.direction === "not_comparable") {
      return <span className="text-slate-500 text-xs font-light">N/A</span>;
    }
    if (delta.direction === "same") {
      return <span className="text-slate-500 text-xs font-light">—</span>;
    }

    const { absolute_difference, percentage_difference, direction } = delta;
    const absStr = absolute_difference !== null ? (absolute_difference > 0 ? `+${absolute_difference.toFixed(precision)}` : absolute_difference.toFixed(precision)) : "";
    const pctStr = percentage_difference !== null ? (percentage_difference > 0 ? `+${percentage_difference.toFixed(1)}` : percentage_difference.toFixed(1)) : null;

    const formattedDiff = pctStr !== null ? `${absStr}${unit} (${pctStr}%)` : `${absStr}${unit}`;

    if (direction === "higher") {
      return (
        <span className="text-teal-400 text-xs font-semibold">
          {formattedDiff}
        </span>
      );
    } else {
      return (
        <span className="text-amber-500 text-xs font-semibold">
          {formattedDiff}
        </span>
      );
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-xl overflow-hidden">
      <div className="p-6 border-b border-slate-800">
        <h3 className="text-lg font-bold text-slate-100">
          📋 Quadro Comparativo de Métricas
        </h3>
        <p className="text-xs text-slate-400 font-light mt-1">
          Diferenças absolutas e percentuais em relação ao cenário base selecionado (
          <span className="text-teal-400 font-bold">{baseline_scenario_name}</span>).
        </p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-950/40 border-b border-slate-800 text-slate-400 text-xs uppercase tracking-wider">
              <th className="p-4 font-bold">Métrica</th>
              {scenarios.map((s) => {
                const isBaseline = s.name === baseline_scenario_name;
                return (
                  <th key={s.name} className="p-4 font-bold min-w-[200px]">
                    {s.name}
                    {isBaseline && (
                      <span className="ml-2 px-2 py-0.5 bg-teal-500/10 text-teal-400 border border-teal-500/20 text-[10px] uppercase rounded-full">
                        Base
                      </span>
                    )}
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 text-slate-300 text-sm">
            {Object.entries(METRIC_CONFIG).map(([key, config]) => {
              return (
                <tr key={key} className="hover:bg-slate-900/30 transition-colors">
                  <td className="p-4 font-medium text-slate-200">{config.label}</td>
                  {scenarios.map((s) => {
                    const isBaseline = s.name === baseline_scenario_name;
                    const val = s.summary[key as keyof typeof s.summary] as number | undefined;
                    const delta = getDelta(s.name, key);

                    return (
                      <td key={s.name} className="p-4">
                        <div className="font-bold text-slate-100">
                          {formatVal(val, config.precision, config.unit)}
                        </div>
                        {!isBaseline && (
                          <div className="mt-1">
                            {renderDelta(delta, config.precision, config.unit)}
                          </div>
                        )}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
