import React, { useEffect, useState } from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import { ScenarioSummaryComparison } from "../../types/simulation";

interface ComparisonChartProps {
  scenarios: ScenarioSummaryComparison[];
  metric: "average_energy" | "burnout" | "net_output" | "total_free_time";
}

export default function ComparisonChart({ scenarios, metric }: ComparisonChartProps) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return <div className="h-80 w-full bg-slate-900 animate-pulse rounded-2xl" />;
  }

  const metricNames: Record<string, string> = {
    average_energy: "Energia Média (%)",
    burnout: "Burnout Final (%)",
    net_output: "Produção Líquida Total (unidades)",
    total_free_time: "Tempo Livre Total (horas)",
  };

  const chartData = scenarios.map((s) => {
    const val = s.summary[metric];
    return {
      Cenário: s.name,
      [metricNames[metric]]: parseFloat(val.toFixed(1)),
    };
  });


  return (
    <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-lg">
      <h3 className="text-sm font-semibold tracking-wide text-slate-300 uppercase mb-6">
        📊 Comparação: {metricNames[metric]}
      </h3>
      <div className="h-80 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
            <XAxis dataKey="Cenário" stroke="#64748b" fontSize={11} tickLine={false} />
            <YAxis stroke="#64748b" fontSize={11} tickLine={false} />
            <Tooltip
              contentStyle={{ backgroundColor: "#0f172a", borderColor: "#334155" }}
              labelStyle={{ color: "#94a3b8", fontWeight: "bold" }}
            />
            <Legend verticalAlign="top" height={36} />
            <Bar dataKey={metricNames[metric]} fill="#14b8a6" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
