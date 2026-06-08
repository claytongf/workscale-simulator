import React, { useEffect, useState } from "react";
import { simulationService } from "../../services/simulation-service";
import { CountryPreset, CountryPresetSummary } from "../../types/simulation";

interface CountryPresetSelectorProps {
  onSelect: (preset: CountryPreset) => void;
}

export default function CountryPresetSelector({ onSelect }: CountryPresetSelectorProps) {
  const [summaries, setSummaries] = useState<CountryPresetSummary[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedKey, setSelectedKey] = useState("");
  const [activePreset, setActivePreset] = useState<CountryPreset | null>(null);

  useEffect(() => {
    async function fetchSummaries() {
      try {
        const data = await simulationService.getCountryPresets();
        setSummaries(data);
      } catch (err) {
        console.error("Failed to load country presets", err);
      }
    }
    fetchSummaries();
  }, []);

  const handleSelectChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const key = e.target.value;
    setSelectedKey(key);
    if (!key) {
      setActivePreset(null);
      return;
    }
    setLoading(true);
    try {
      const fullPreset = await simulationService.getCountryPreset(key);
      setActivePreset(fullPreset);
      onSelect(fullPreset);
    } catch (err) {
      console.error("Failed to load preset detail", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-2 bg-slate-950/40 p-4 rounded-xl border border-slate-800/60">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider">
          🗺️ Pré-configurar por País
        </label>
        {loading && <span className="text-[10px] text-teal-400 animate-pulse">Carregando dados...</span>}
      </div>
      <select
        value={selectedKey}
        onChange={handleSelectChange}
        className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-300 focus:outline-none focus:border-teal-500"
      >
        <option value="">-- Selecione um país (Opcional) --</option>
        {summaries.map((s) => (
          <option key={s.key} value={s.key}>
            {s.country_name} ({s.preset_name}) - {s.currency}
          </option>
        ))}
      </select>

      {activePreset && (
        <div className="mt-2 text-[11px] text-slate-400 space-y-1 bg-slate-950/60 p-2.5 rounded-lg border border-slate-850">
          <p>
            <strong>Regras de Horas Extras:</strong> {activePreset.overtime_rules_summary}
          </p>
          {activePreset.notes && (
            <p>
              <strong>Notas:</strong> {activePreset.notes}
            </p>
          )}
          <p className="text-[10px] text-slate-500">
            Fonte:{" "}
            <a
              href={activePreset.source_url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-teal-400 hover:underline"
            >
              {activePreset.source_label}
            </a>{" "}
            (Atualizado em: {activePreset.last_updated})
          </p>
        </div>
      )}

      <p className="text-[10px] text-slate-500 leading-normal font-light">
        ⚠️ <strong>Aviso:</strong> Os presets de países são estimativas educacionais e não substituem assessoria contábil, jurídica, tributária ou trabalhista profissional.
      </p>
    </div>
  );
}
