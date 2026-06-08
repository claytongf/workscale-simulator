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
import { DailySimulationResult } from "../../types/simulation";

interface OutputChartProps {
  data: DailySimulationResult[];
}

export default function OutputChart({ data }: OutputChartProps) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return <div className="h-72 w-full bg-slate-900 animate-pulse rounded-2xl" />;
  }

  // Aggregate by week or show daily if short period
  const isLong = data.length > 45;
  
  let chartData = [];
  if (isLong) {
    // Group by 7-day chunks (weeks)
    let weekIndex = 1;
    for (let i = 0; i < data.length; i += 7) {
      const chunk = data.slice(i, i + 7);
      const grossSum = chunk.reduce((sum, d) => sum + d.gross_output, 0);
      const netSum = chunk.reduce((sum, d) => sum + d.net_output, 0);
      chartData.push({
        name: `Sem ${weekIndex++}`,
        "Prod. Bruta": parseFloat(grossSum.toFixed(1)),
        "Prod. Líquida": parseFloat(netSum.toFixed(1)),
      });
    }
  } else {
    chartData = data.map((d) => ({
      name: `Dia ${d.day}`,
      "Prod. Bruta": parseFloat(d.gross_output.toFixed(1)),
      "Prod. Líquida": parseFloat(d.net_output.toFixed(1)),
    }));
  }

  return (
    <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-lg">
      <h3 className="text-sm font-semibold tracking-wide text-slate-300 uppercase mb-4">
        📊 {isLong ? "Produção Semanal Acumulada" : "Produção Diária"}
      </h3>
      <div className="h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
            <XAxis dataKey="name" stroke="#64748b" fontSize={11} tickLine={false} />
            <YAxis stroke="#64748b" fontSize={11} tickLine={false} />
            <Tooltip
              contentStyle={{ backgroundColor: "#0f172a", borderColor: "#334155" }}
              labelStyle={{ color: "#94a3b8", fontWeight: "bold" }}
            />
            <Legend verticalAlign="top" height={36} />
            <Bar dataKey="Prod. Bruta" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
            <Bar dataKey="Prod. Líquida" fill="#ec4899" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
