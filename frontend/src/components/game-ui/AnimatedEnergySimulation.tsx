import React, { useState, useEffect, useMemo } from "react";
import { AnimatedScenario, DailySimulationResult } from "../../types/simulation";
import SimulationPlaybackControls from "./SimulationPlaybackControls";
import ScenarioEnergyPanel from "./ScenarioEnergyPanel";

interface AnimatedEnergySimulationProps {
  scenarios: AnimatedScenario[];
}

const SPEED_TO_INTERVAL_MS: Record<number, number> = {
  0.5: 2000,
  1: 1000,
  2: 500,
  5: 200,
};

type NormalizedAnimatedScenario = {
  name: string;
  dailyResults: DailySimulationResult[];
};

function getDailyResults(scenario: AnimatedScenario): DailySimulationResult[] {
  const directScenario = scenario as unknown as {
    daily_results?: DailySimulationResult[];
  };

  return scenario.result?.daily_results ?? directScenario.daily_results ?? [];
}

export default function AnimatedEnergySimulation({ scenarios }: AnimatedEnergySimulationProps) {
  const visibleScenarios = useMemo<NormalizedAnimatedScenario[]>(
    () =>
      scenarios
        .slice(0, 3)
        .map((scenario) => ({
          name: scenario.name,
          dailyResults: getDailyResults(scenario),
        }))
        .filter((scenario) => scenario.dailyResults.length > 0),
    [scenarios],
  );
  const [currentDayIndex, setCurrentDayIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);

  const maxDays = visibleScenarios.length > 0
    ? Math.max(...visibleScenarios.map((s) => s.dailyResults.length))
    : 0;

  const speedMs = SPEED_TO_INTERVAL_MS[speed] ?? SPEED_TO_INTERVAL_MS[1];

  useEffect(() => {
    setCurrentDayIndex(0);
    setIsPlaying(false);
  }, [visibleScenarios]);

  useEffect(() => {
    if (maxDays === 0) {
      setCurrentDayIndex(0);
      setIsPlaying(false);
      return;
    }

    setCurrentDayIndex((current) => Math.min(current, maxDays - 1));
  }, [maxDays]);

  useEffect(() => {
    if (!isPlaying || maxDays === 0) return;

    const intervalId = setInterval(() => {
      setCurrentDayIndex((prev) => {
        if (prev >= maxDays - 1) {
          setIsPlaying(false);
          return prev;
        }
        return prev + 1;
      });
    }, speedMs);

    return () => clearInterval(intervalId);
  }, [isPlaying, speedMs, maxDays]);

  const handlePlayToggle = () => {
    if (maxDays === 0) return;

    if (currentDayIndex >= maxDays - 1) {
      setCurrentDayIndex(0);
    }
    setIsPlaying((playing) => !playing);
  };

  const handleRestart = () => {
    setCurrentDayIndex(0);
    setIsPlaying(false);
  };

  const handleSpeedChange = (newSpeed: number) => {
    setSpeed(newSpeed);
  };

  const handleSeek = (dayIndex: number) => {
    if (maxDays === 0) return;

    const validIndex = Math.min(maxDays - 1, Math.max(0, dayIndex));
    setCurrentDayIndex(validIndex);
  };

  if (visibleScenarios.length === 0 || maxDays === 0) {
    return (
      <div className="bg-slate-900/40 border border-slate-800 p-8 rounded-2xl text-center">
        <p className="text-slate-400 font-medium">Nenhum cenário configurado para simulação.</p>
      </div>
    );
  }

  const gridLayoutClass =
    visibleScenarios.length === 1
      ? "grid-cols-1 max-w-xl mx-auto"
      : visibleScenarios.length === 2
      ? "grid-cols-1 md:grid-cols-2 max-w-5xl mx-auto"
      : "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 max-w-7xl mx-auto";

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="max-w-xl mx-auto">
        <SimulationPlaybackControls
          currentDayIndex={currentDayIndex}
          totalDays={maxDays}
          isPlaying={isPlaying}
          speed={speed}
          onPlayToggle={handlePlayToggle}
          onRestart={handleRestart}
          onSpeedChange={handleSpeedChange}
          onSeek={handleSeek}
        />
      </div>

      <div className={`grid gap-6 ${gridLayoutClass}`}>
        {visibleScenarios.map((scenario) => (
          <ScenarioEnergyPanel
            key={scenario.name}
            name={scenario.name}
            dailyResults={scenario.dailyResults}
            currentDayIndex={currentDayIndex}
          />
        ))}
      </div>
    </div>
  );
}
