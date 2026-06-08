import React from "react";
import { SimulationResult } from "../../types/simulation";
import EnergyBar from "../game-ui/EnergyBar";
import BurnoutBar from "../game-ui/BurnoutBar";
import ProductivityBar from "../game-ui/ProductivityBar";
import StatCard from "./StatCard";
import EnergyChart from "../charts/EnergyChart";
import BurnoutChart from "../charts/BurnoutChart";
import OutputChart from "../charts/OutputChart";

interface SimulationSummaryProps {
  result: SimulationResult;
}

export default function SimulationSummary({ result }: SimulationSummaryProps) {
  const { summary, daily_results, company, pricing } = result;

  return (
    <div className="space-y-8 animate-fade-in">
      {/* 1. Game Status HUD */}
      <div className="bg-slate-900/40 border border-slate-800/80 p-6 rounded-2xl backdrop-blur-md">
        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4">
          🎮 Status do Trabalhador (HUD)
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <EnergyBar value={summary.final_energy} />
          <BurnoutBar value={summary.burnout} />
          <ProductivityBar value={summary.average_energy} /> {/* energy factor proxy */}
        </div>
      </div>

      {/* 2. Worker & Schedule Output Stats */}
      <div>
        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4">
          📈 Métricas de Produtividade & Jornada
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Produção Bruta"
            value={`${summary.gross_output.toFixed(0)} un`}
            subtitle="Total produzido no período"
            color="purple"
          />
          <StatCard
            title="Produção Líquida"
            value={`${summary.net_output.toFixed(0)} un`}
            subtitle="Produção sem erros e defeitos"
            color="emerald"
          />
          <StatCard
            title="Taxa de Erro Média"
            value={`${(summary.average_error_rate * 100).toFixed(1)}%`}
            subtitle="Média de erros gerados"
            color="rose"
          />
          <StatCard
            title="Tempo Livre Total"
            value={`${summary.total_free_time.toFixed(0)}h`}
            subtitle="Lazer, família e descanso"
            color="teal"
          />
          <StatCard
            title="Total Horas Trabalhadas"
            value={`${summary.total_hours_worked.toFixed(0)}h`}
            subtitle="Horas efetivas na escala"
            color="slate"
          />
          <StatCard
            title="Energia Média"
            value={`${summary.average_energy.toFixed(1)}%`}
            subtitle="Nível médio de energia"
            color="emerald"
          />
        </div>
      </div>

      {/* 3. Company & Pricing Stats (If active) */}
      {(company || pricing) && (
        <div>
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4">
            💼 Impacto Financeiro & Precificação
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {company && (
              <>
                <StatCard
                  title="Custo Total do Trabalhador"
                  value={`R$ ${company.employee_total_cost.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
                  subtitle="Salário bruto + encargos + provisões + benefícios"
                  color="indigo"
                />
                <StatCard
                  title="Custo Mensal da Empresa"
                  value={`R$ ${company.company_monthly_cost.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
                  subtitle="Custo operacional total do negócio"
                  color="purple"
                />
                <StatCard
                  title="Custo de Retrabalho"
                  value={`R$ ${company.rework_costs.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
                  subtitle="Prejuízo devido a erros do trabalhador"
                  color="rose"
                />
              </>
            )}
            {pricing && (
              <>
                <StatCard
                  title="Custo por Unidade"
                  value={`R$ ${pricing.unit_cost.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
                  subtitle="Custo de produção por unidade líquida"
                  color="amber"
                />
                <StatCard
                  title="Preço Final Projetado"
                  value={`R$ ${pricing.final_price.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
                  subtitle="Preço com base na margem desejada"
                  color="teal"
                />
              </>
            )}
          </div>
        </div>
      )}

      {/* 4. Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <EnergyChart data={daily_results} />
        <BurnoutChart data={daily_results} />
      </div>
      <div>
        <OutputChart data={daily_results} />
      </div>
    </div>
  );
}
