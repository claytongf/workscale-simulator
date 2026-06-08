import React from "react";
import Link from "next/link";
import AppShell from "../components/layout/AppShell";

export default function Home() {
  return (
    <AppShell>
      <div className="py-16 md:py-24 flex flex-col items-center text-center gap-8 max-w-4xl mx-auto">
        {/* Badge */}
        <span className="px-3 py-1 rounded-full bg-teal-500/10 border border-teal-500/20 text-teal-400 font-semibold text-xs tracking-wider uppercase">
          Simulador Educacional de Escalas
        </span>

        {/* Hero title */}
        <h1 className="text-4xl md:text-7xl font-extrabold tracking-tight leading-[1.1] bg-clip-text text-transparent bg-gradient-to-b from-white via-slate-100 to-slate-400">
          Simule e Compare Jornadas de Trabalho
        </h1>

        {/* Description */}
        <p className="text-lg md:text-xl text-slate-400 font-light leading-relaxed max-w-2xl">
          Analise de forma transparente o impacto de escalas de trabalho (como 6x1, 5x2, 4x3 e 12x36) no nível de energia do trabalhador, esgotamento (burnout), produtividade e precificação de serviços.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-4 mt-6">
          <Link
            href="/simulator"
            className="w-full sm:w-auto bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600 text-slate-950 font-bold px-8 py-3.5 rounded-xl shadow-lg shadow-teal-500/10 hover:shadow-teal-500/20 active:scale-95 transition-all text-sm"
          >
            🚀 Abrir Simulador
          </Link>
          <Link
            href="/compare"
            className="w-full sm:w-auto bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800 hover:border-slate-700 font-bold px-8 py-3.5 rounded-xl active:scale-95 transition-all text-sm"
          >
            📊 Comparar Cenários
          </Link>
        </div>

        {/* Grid cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full mt-16 text-left">
          <div className="p-6 rounded-2xl bg-slate-900/40 border border-slate-900/80 hover:border-slate-800/80 transition-all">
            <div className="text-teal-400 text-lg mb-2 font-semibold flex items-center gap-2">
              🔋 Energia e Burnout
            </div>
            <p className="text-sm text-slate-400 leading-relaxed font-light">
              Mapeia a capacidade física e mental diária em conjunto com o acúmulo de fadiga a longo prazo.
            </p>
          </div>
          <div className="p-6 rounded-2xl bg-slate-900/40 border border-slate-900/80 hover:border-slate-800/80 transition-all">
            <div className="text-teal-400 text-lg mb-2 font-semibold flex items-center gap-2">
              📈 Eficiência e Produção
            </div>
            <p className="text-sm text-slate-400 leading-relaxed font-light">
              Analisa a produtividade base, taxas de erro e experiência para projetar a entrega líquida de trabalho.
            </p>
          </div>
          <div className="p-6 rounded-2xl bg-slate-900/40 border border-slate-900/80 hover:border-slate-800/80 transition-all">
            <div className="text-teal-400 text-lg mb-2 font-semibold flex items-center gap-2">
              🏷️ Custos e Margens
            </div>
            <p className="text-sm text-slate-400 leading-relaxed font-light">
              Avalia o impacto de encargos patronais, benefícios e custos de retrabalho na precificação final de serviços.
            </p>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
