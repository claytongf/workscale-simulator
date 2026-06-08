"use client";

import React, { useState } from "react";
import AppShell from "../../components/layout/AppShell";
import ScenarioForm from "../../components/forms/ScenarioForm";
import SimulationSummary from "../../components/dashboard/SimulationSummary";
import ExportReportButtons from "../../components/dashboard/ExportReportButtons";
import { simulationService } from "../../services/simulation-service";
import { SimulationResult } from "../../types/simulation";
import { SimulationInputForm } from "../../schemas/scenario.schema";
import AnimatedEnergySimulation from "../../components/game-ui/AnimatedEnergySimulation";

export default function SimulatorPage() {
  const [result, setResult] = useState<SimulationResult | null>(null);
  const [lastInput, setLastInput] = useState<SimulationInputForm | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"summary" | "animation">("summary");

  const handleRunSimulation = async (formData: SimulationInputForm) => {
    setLoading(true);
    setError(null);
    setLastInput(formData);
    setActiveTab("summary");
    try {
      const res = await simulationService.runSimulation(formData as any);
      setResult(res);
    } catch (err: any) {
      setError(err.message || "Ocorreu um erro ao rodar a simulação.");
      setResult(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppShell>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-100">
            Simulador de Jornadas
          </h1>
          <p className="text-sm text-slate-400 font-light mt-1">
            Configure as variáveis de jornada, trabalhador e finanças para analisar os resultados acumulados.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-5">
            <ScenarioForm onSubmit={handleRunSimulation} isLoading={loading} />
          </div>

          <div className="lg:col-span-7 space-y-6">
            {loading && (
              <div className="bg-slate-900/40 border border-slate-800/80 p-8 rounded-2xl text-center backdrop-blur-md">
                <div className="w-8 h-8 border-4 border-teal-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                <p className="text-slate-400 font-medium">Calculando projeções da simulação...</p>
                <p className="text-xs text-slate-500 mt-1">Rodando simulações diárias no servidor de cálculo.</p>
              </div>
            )}

            {error && (
              <div className="bg-red-500/10 border border-red-500/20 p-6 rounded-2xl text-red-400">
                <h4 className="font-bold mb-1">Erro de Simulação</h4>
                <p className="text-sm font-light">{error}</p>
              </div>
            )}

            {!loading && !error && !result && (
              <div className="bg-slate-900/20 border border-dashed border-slate-800 p-12 rounded-2xl text-center">
                <p className="text-slate-500 font-light text-sm">
                  Configure os dados ao lado e clique em <strong>Rodar Simulação</strong> para ver os resultados.
                </p>
              </div>
            )}

            {!loading && !error && result && (
              <div className="space-y-6">
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
                    📊 Painel de Resumo
                  </button>
                  <button
                    onClick={() => setActiveTab("animation")}
                    className={`px-4 py-2 border-b-2 font-bold text-sm transition-all ${
                      activeTab === "animation"
                        ? "border-teal-500 text-teal-400"
                        : "border-transparent text-slate-400 hover:text-slate-200"
                    }`}
                  >
                    🎮 Simulação Animada
                  </button>
                </div>

                {activeTab === "summary" ? (
                  <div className="space-y-6">
                    {lastInput && (
                      <ExportReportButtons
                        simulationInput={lastInput as any}
                        defaultTitle="Relatório de Simulação WorkScale"
                      />
                    )}
                    <SimulationSummary result={result} />
                  </div>
                ) : (
                  <AnimatedEnergySimulation
                    scenarios={[
                      {
                        name: lastInput ? `Cenário (${lastInput.schedule.type})` : "Cenário Único",
                        result: result,
                      },
                    ]}
                  />
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </AppShell>
  );
}
