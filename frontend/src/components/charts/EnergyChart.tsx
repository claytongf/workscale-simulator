import React, { useEffect, useState } from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import { DailySimulationResult } from "../../types/simulation";

interface EnergyChartProps {
  data: DailySimulationResult[];
}

export default function EnergyChart({ data }: EnergyChartProps) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return <div className="h-72 w-full bg-slate-900 animate-pulse rounded-2xl" />;
  }

  // Format data for chart
  const chartData = data.map((d) => ({
    dia: `Dia ${d.day}`,
    "Energia Inicial": parseFloat(d.energy_start.toFixed(1)),
    "Energia Final": parseFloat(d.energy_end.toFixed(1)),
  }));

  return (
    <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-lg">
      <h3 className="text-sm font-semibold tracking-wide text-slate-300 uppercase mb-4">
        📈 Energia ao Longo do Tempo
      </h3>
      <div className="h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
            <XAxis dataKey="dia" stroke="#64748b" fontSize={11} tickLine={false} />
            <YAxis stroke="#64748b" fontSize={11} tickLine={false} domain={[0, 100]} />
            <Tooltip
              contentStyle={{ backgroundColor: "#0f172a", borderColor: "#334155" }}
              labelStyle={{ color: "#94a3b8", fontWeight: "bold" }}
            />
            <Legend verticalAlign="top" height={36} />
            <Line
              type="monotone"
              dataKey="Energia Inicial"
              stroke="#06b6d4"
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4 }}
            />
            <Line
              type="monotone"
              dataKey="Energia Final"
              stroke="#10b981"
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
