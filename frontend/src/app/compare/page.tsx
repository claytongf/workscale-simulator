"use client";

import React, { useState } from "react";
import AppShell from "../../components/layout/AppShell";
import ComparisonScenarioForm from "../../components/forms/ComparisonScenarioForm";
import { simulationService } from "../../services/simulation-service";
import { CompareSimulationsResult } from "../../types/simulation";
import ComparisonChart from "../../components/charts/ComparisonChart";
import ScenarioComparisonTable from "../../components/dashboard/ScenarioComparisonTable";
import ExportReportButtons from "../../components/dashboard/ExportReportButtons";
import AnimatedEnergySimulation from "../../components/game-ui/AnimatedEnergySimulation";

export default function ComparePage() {
  const [result, setResult] = useState<CompareSimulationsResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeMetric, setActiveMetric] = useState<
    "average_energy" | "burnout" | "net_output" | "total_free_time"
  >("average_energy");
  const [lastFormData, setLastFormData] = useState<any>(null);
  const [baselineName, setBaselineName] = useState<string | undefined>(undefined);
  const [activeTab, setActiveTab] = useState<"summary" | "animation">("summary");

  const handleRunComparison = async (formData: any, customBaseline?: string) => {
    setLoading(true);
    setError(null);
    setLastFormData(formData);
    setActiveTab("summary");
    try {
      // Re-map form structures to the API payload
      const payload = {
        baseline_scenario_name: customBaseline,
        scenarios: formData.scenarios.map((s: any) => ({
          name: s.name,
          simulation: {
            period_days: s.period_days,
            worker: s.worker,
            schedule: s.schedule,
          },
        })),
      };
      const res = await simulationService.compareSimulations(payload);
      setResult(res);
      setBaselineName(res.baseline_scenario_name);
    } catch (err: any) {
      setError(err.message || "Ocorreu um erro ao comparar os cenários.");
      setResult(null);
    } finally {
      setLoading(false);
    }
  };

  const handleBaselineChange = (newBaseline: string) => {
    if (lastFormData) {
      handleRunComparison(lastFormData, newBaseline);
    }
  };

  const metrics = [
    { id: "average_energy", label: "🔋 Energia Média" },
    { id: "burnout", label: "🔥 Burnout Final" },
    { id: "net_output", label: "📊 Produção Líquida" },
    { id: "total_free_time", label: "⏰ Tempo Livre Total" },
  ] as const;

  const comparisonInput = lastFormData
    ? {
        baseline_scenario_name: baselineName,
        scenarios: lastFormData.scenarios.map((s: any) => ({
          name: s.name,
          simulation: {
            period_days: s.period_days,
            worker: s.worker,
            schedule: s.schedule,
          },
        })),
      }
    : undefined;

  return (
    <AppShell>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-100">
            Comparar Cenários
          </h1>
          <p className="text-sm text-slate-400 font-light mt-1">
            Configure duas jornadas e perfis de trabalhador diferentes para analisar os prós e contras de cada escolha.
          </p>
        </div>

        <ComparisonScenarioForm onSubmit={(data) => handleRunComparison(data)} isLoading={loading} />

        {loading && (
          <div className="bg-slate-900/40 border border-slate-800/80 p-12 rounded-2xl text-center backdrop-blur-md">
            <div className="w-8 h-8 border-4 border-teal-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-slate-400 font-medium">Comparando simulações no servidor...</p>
          </div>
        )}

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 p-6 rounded-2xl text-red-400">
            <h4 className="font-bold mb-1">Erro de Comparação</h4>
            <p className="text-sm font-light">{error}</p>
          </div>
        )}

        {!loading && !error && result && (
          <div className="space-y-8 animate-fade-in">
            {/* Tabs */}
            <div className="flex border-b border-slate-800">
              <button
                onClick={() => setActiveTab("summary")}
                className={`px-4 py-2 border-b-2 font-bold text-sm transition-all ${
                  activeTab === "summary"
                    ? "border-teal-500 text-teal-400"
                    : "border-transparent text-slate-400 hover:text-slate-200"
                }`}
              >
                📊 Relatório Comparativo
              </button>
              <button
                onClick={() => setActiveTab("animation")}
                className={`px-4 py-2 border-b-2 font-bold text-sm transition-all ${
                  activeTab === "animation"
                    ? "border-teal-500 text-teal-400"
                    : "border-transparent text-slate-400 hover:text-slate-200"
                }`}
              >
                🎮 Simulação Comparativa Animada
              </button>
            </div>

            {activeTab === "summary" ? (
              <>
                {/* Controls Bar: Baseline Selector & Export Buttons */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
                  <div className="flex items-center space-x-3 bg-slate-900 border border-slate-800 p-4 rounded-2xl w-full">
                    <label htmlFor="baseline-select" className="text-xs font-bold text-slate-400 uppercase whitespace-nowrap">
                      Cenário Base:
                    </label>
                <select
                  id="baseline-select"
                  value={baselineName || ""}
                  onChange={(e) => handleBaselineChange(e.target.value)}
                  className="bg-slate-950 border border-slate-800 text-slate-200 text-sm rounded-lg block w-full p-2 focus:border-teal-500 focus:ring-0 outline-none"
                >
                  {result.scenarios.map((s) => (
                    <option key={s.name} value={s.name}>
                      {s.name}
                    </option>
                  ))}
                </select>
              </div>

              {comparisonInput && (
                <div className="md:col-span-2">
                  <ExportReportButtons
                    comparisonInput={comparisonInput as any}
                    defaultTitle="Relatório Comparativo WorkScale"
                  />
                </div>
              )}
            </div>

            {/* Metrics Comparison Table */}
            <ScenarioComparisonTable comparisonResult={result} />

            {/* Metric selection tabs */}
            <div className="space-y-4">
              <div className="flex flex-wrap gap-2 border-b border-slate-800 pb-4">
                {metrics.map((m) => (
                  <button
                    key={m.id}
                    onClick={() => setActiveMetric(m.id)}
                    className={`px-4 py-2 rounded-lg text-xs font-bold border transition-all ${
                      activeMetric === m.id
                        ? "bg-teal-500 text-slate-950 border-teal-500"
                        : "bg-slate-900 text-slate-400 border-slate-800 hover:text-slate-200"
                    }`}
                  >
                    {m.label}
                  </button>
                ))}
              </div>

              {/* Comparison graph */}
              <div className="max-w-3xl mx-auto">
                <ComparisonChart scenarios={result.scenarios} metric={activeMetric} />
              </div>
            </div>

                {/* Side-by-side details cards */}
                <div className={`grid grid-cols-1 md:grid-cols-2 ${result.scenarios.length === 3 ? "lg:grid-cols-3" : ""} gap-8`}>
                  {result.scenarios.map((s) => (
                    <div key={s.name} className="bg-slate-900/40 border border-slate-800/80 p-6 rounded-2xl">
                      <h3 className="text-lg font-bold text-teal-400 mb-4 border-b border-slate-800 pb-2">
                        {s.name}
                      </h3>
                      <div className="space-y-3 text-sm">
                        <div className="flex justify-between">
                          <span className="text-slate-500 font-light">Energia Média</span>
                          <span className="text-slate-200 font-bold">{s.summary.average_energy.toFixed(1)}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500 font-light">Energia Final</span>
                          <span className="text-slate-200 font-bold">{s.summary.final_energy.toFixed(1)}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500 font-light">Burnout Acumulado</span>
                          <span className="text-slate-200 font-bold">{s.summary.burnout.toFixed(1)}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500 font-light">Produção Líquida</span>
                          <span className="text-slate-200 font-bold">{s.summary.net_output.toFixed(0)} un</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500 font-light">Erros Médios</span>
                          <span className="text-slate-200 font-bold">{(s.summary.average_error_rate * 100).toFixed(1)}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500 font-light">Tempo Livre Total</span>
                          <span className="text-slate-200 font-bold">{s.summary.total_free_time.toFixed(0)}h</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <AnimatedEnergySimulation
                scenarios={result.scenarios.map((s) => ({
                  name: s.name,
                  result: {
                    summary: s.summary,
                    daily_results: s.daily_results,
                    company: s.company,
                    pricing: s.pricing,
                  },
                }))}
              />
            )}
          </div>
        )}
      </div>
    </AppShell>
  );
}
