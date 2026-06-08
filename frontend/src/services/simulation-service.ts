import { apiFetch } from "./api";
import {
  SimulationInput,
  SimulationResult,
  CompareSimulationsInput,
  CompareSimulationsResult,
  CountryPreset,
  CountryPresetSummary,
} from "../types/simulation";

export const simulationService = {
  runSimulation(payload: SimulationInput): Promise<SimulationResult> {
    return apiFetch<SimulationResult>("/api/simulations", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },

  compareSimulations(payload: CompareSimulationsInput): Promise<CompareSimulationsResult> {
    return apiFetch<CompareSimulationsResult>("/api/simulations/compare", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },

  getCountryPresets(): Promise<CountryPresetSummary[]> {
    return apiFetch<CountryPresetSummary[]>("/api/countries/presets");
  },

  getCountryPreset(key: string): Promise<CountryPreset> {
    return apiFetch<CountryPreset>(`/api/countries/presets/${key}`);
  },
};

