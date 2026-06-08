import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { SimulationInputSchema, SimulationInputForm } from "../../schemas/scenario.schema";
import CountryPresetSelector from "./CountryPresetSelector";
import { CountryPreset } from "../../types/simulation";

interface ScenarioFormProps {
  onSubmit: (data: SimulationInputForm) => void;
  isLoading: boolean;
}

export default function ScenarioForm({ onSubmit, isLoading }: ScenarioFormProps) {
  const [showCompany, setShowCompany] = useState(false);
  const [showPricing, setShowPricing] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<any>({
    resolver: zodResolver(SimulationInputSchema),
    defaultValues: {
      period_days: 30,
      worker: {
        job_type: "office",
        job_energy_cost_per_hour: 5.0,
        monthly_salary: 3000.0,
        productivity_level: 5,
        experience_level: 5,
        sleep_hours: 7.0,
        sleep_quality_factor: 1.0,
        commute_hours: 1.0,
        base_output_per_hour: 1.0,
        base_error_rate: 0.05,
      },
      schedule: {
        type: "5x2",
        hours_per_day: 8.0,
        vacation_days_per_year: 0,
      },
      companyEnabled: false,
      company: {
        number_of_employees: 1,
        gross_salary: 3000.0,
        total_employer_tax_rate: 0.0,
        benefits: 0.0,
        vacation_provision_rate: 0.0833,
        vacation_bonus_provision: 0.0,
        thirteenth_salary_rate: 0.0833,
        training_cost: 0.0,
        absenteeism_cost: 0.0,
        turnover_cost: 0.0,
        equipment_cost: 0.0,
        fixed_costs: 0.0,
        variable_costs: 0.0,
        material_costs: 0.0,
        operational_costs: 0.0,
        taxes_on_revenue: 0.0,
        rework_cost_per_error: 0.0,
      },
      pricingEnabled: false,
      pricing: {
        desired_margin: 0.30,
      },
    },
  });

  const formErrors = errors as any;
  const watchScheduleType = watch("schedule.type");

  const handlePresetSelect = (preset: CountryPreset) => {
    // Prefill schedule
    setValue("schedule.type", "5x2");
    setValue(
      "schedule.hours_per_day",
      Number((preset.default_weekly_hours / preset.default_workdays_per_week).toFixed(1))
    );
    setValue("schedule.vacation_days_per_year", preset.paid_vacation_days_per_year);
    if (preset.default_workdays_per_week) {
      setValue("schedule.workdays_per_week", preset.default_workdays_per_week);
    }
    // Prefill company total tax rate
    const taxSum =
      preset.employer_tax_rates.inss +
      preset.employer_tax_rates.fgts +
      preset.employer_tax_rates.rat_sat +
      preset.employer_tax_rates.third_party +
      preset.employer_tax_rates.social_security +
      preset.employer_tax_rates.medicare +
      preset.employer_tax_rates.futa +
      preset.employer_tax_rates.suta +
      preset.employer_tax_rates.national_insurance +
      preset.employer_tax_rates.other;
    setValue("company.total_employer_tax_rate", Number(taxSum.toFixed(4)));

    // Prefill company benefits
    const benefitSum =
      preset.benefit_defaults.transport +
      preset.benefit_defaults.meal +
      preset.benefit_defaults.health +
      preset.benefit_defaults.other;
    setValue("company.benefits", Number(benefitSum.toFixed(2)));
  };

  const submitHandler = (data: SimulationInputForm) => {
    // If sections are disabled, clean up the values
    const payload = {
      period_days: data.period_days,
      worker: data.worker,
      schedule: data.schedule,
      company: showCompany ? data.company : undefined,
      pricing: showPricing ? data.pricing : undefined,
    };
    onSubmit(payload as any);
  };

  return (
    <form
      onSubmit={handleSubmit(submitHandler)}
      className="space-y-6 bg-slate-900/40 border border-slate-800/80 p-6 rounded-2xl backdrop-blur-md"
    >
      <div className="border-b border-slate-800 pb-4">
        <h2 className="text-lg font-bold text-slate-100">Configurar Cenário</h2>
        <p className="text-xs text-slate-500">Defina as premissas para rodar o modelo educacional.</p>
      </div>

      {/* Country Preset Selector */}
      <CountryPresetSelector onSelect={handlePresetSelect} />

      {/* 1. Period & Schedule */}
      <div className="space-y-4">
        <h3 className="text-sm font-semibold tracking-wide text-teal-400 uppercase">1. Período e Escala</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">Duração da Simulação (dias)</label>
            <select
              {...register("period_days", { valueAsNumber: true })}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-300 focus:outline-none focus:border-teal-500"
            >
              <option value={7}>7 dias</option>
              <option value={30}>30 dias</option>
              <option value={90}>90 dias</option>
              <option value={365}>365 dias</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">Tipo de Escala</label>
            <select
              {...register("schedule.type")}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-300 focus:outline-none focus:border-teal-500"
            >
              <option value="5x2">5x2 (5 dias trabalho, 2 folga)</option>
              <option value="6x1">6x1 (6 dias trabalho, 1 folga)</option>
              <option value="4x3">4x3 (4 dias trabalho, 3 folga)</option>
              <option value="12x36">12x36 (12h trabalho, 36h folga)</option>
              <option value="custom">Customizada (Dias customizados)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">Horas de Trabalho por Dia</label>
            <input
              type="number"
              step="0.5"
              {...register("schedule.hours_per_day", { valueAsNumber: true })}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-300 focus:outline-none focus:border-teal-500"
            />
            {formErrors.schedule?.hours_per_day && (
              <span className="text-[11px] text-red-500">{formErrors.schedule.hours_per_day.message}</span>
            )}
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">Férias Anuais (dias de folga)</label>
            <input
              type="number"
              {...register("schedule.vacation_days_per_year", { valueAsNumber: true })}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-300 focus:outline-none focus:border-teal-500"
            />
            {formErrors.schedule?.vacation_days_per_year && (
              <span className="text-[11px] text-red-500">{formErrors.schedule.vacation_days_per_year.message}</span>
            )}
          </div>

          {watchScheduleType === "custom" && (
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Dias Trabalhados por Semana</label>
              <input
                type="number"
                {...register("schedule.workdays_per_week", { valueAsNumber: true })}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-300 focus:outline-none focus:border-teal-500"
              />
              {formErrors.schedule?.workdays_per_week && (
                <span className="text-[11px] text-red-500">{formErrors.schedule.workdays_per_week.message}</span>
              )}
            </div>
          )}
        </div>
      </div>

      {/* 2. Worker parameters */}
      <div className="space-y-4 pt-4 border-t border-slate-800">
        <h3 className="text-sm font-semibold tracking-wide text-teal-400 uppercase">2. Perfil do Trabalhador</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">Nível de Produtividade (1 a 10)</label>
            <input
              type="number"
              {...register("worker.productivity_level", { valueAsNumber: true })}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-300 focus:outline-none focus:border-teal-500"
            />
            {formErrors.worker?.productivity_level && (
              <span className="text-[11px] text-red-500">{formErrors.worker.productivity_level.message}</span>
            )}
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">Nível de Experiência (1 a 10)</label>
            <input
              type="number"
              {...register("worker.experience_level", { valueAsNumber: true })}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-300 focus:outline-none focus:border-teal-500"
            />
            {formErrors.worker?.experience_level && (
              <span className="text-[11px] text-red-500">{formErrors.worker.experience_level.message}</span>
            )}
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">Horas de Sono por Noite</label>
            <input
              type="number"
              step="0.5"
              {...register("worker.sleep_hours", { valueAsNumber: true })}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-300 focus:outline-none focus:border-teal-500"
            />
            {formErrors.worker?.sleep_hours && (
              <span className="text-[11px] text-red-500">{formErrors.worker.sleep_hours.message}</span>
            )}
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">Horas de Deslocamento (Ida e Volta)</label>
            <input
              type="number"
              step="0.5"
              {...register("worker.commute_hours", { valueAsNumber: true })}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-300 focus:outline-none focus:border-teal-500"
            />
            {formErrors.worker?.commute_hours && (
              <span className="text-[11px] text-red-500">{formErrors.worker.commute_hours.message}</span>
            )}
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">Produção Base por Hora (unidades)</label>
            <input
              type="number"
              step="0.1"
              {...register("worker.base_output_per_hour", { valueAsNumber: true })}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-300 focus:outline-none focus:border-teal-500"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">Taxa de Erro Base (0.00 a 1.00)</label>
            <input
              type="number"
              step="0.01"
              {...register("worker.base_error_rate", { valueAsNumber: true })}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-300 focus:outline-none focus:border-teal-500"
            />
          </div>
        </div>
      </div>

      {/* 3. Company costs (Optional toggler) */}
      <div className="pt-4 border-t border-slate-800">
        <label className="flex items-center gap-2 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={showCompany}
            onChange={(e) => {
              setShowCompany(e.target.checked);
              setValue("companyEnabled", e.target.checked);
            }}
            className="rounded border-slate-800 bg-slate-950 text-teal-500 focus:ring-0 focus:ring-offset-0"
          />
          <span className="text-sm font-semibold tracking-wide text-teal-400 uppercase">
            💼 Ativar Custos da Empresa (Opcional)
          </span>
        </label>

        {showCompany && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4 bg-slate-950/40 p-4 rounded-xl border border-slate-800/60">
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Número de Funcionários</label>
              <input
                type="number"
                {...register("company.number_of_employees", { valueAsNumber: true })}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-300 focus:outline-none focus:border-teal-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Salário Bruto Mensal</label>
              <input
                type="number"
                {...register("company.gross_salary", { valueAsNumber: true })}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-300 focus:outline-none focus:border-teal-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Encargos Patronais (Ex: 0.20 para 20%)</label>
              <input
                type="number"
                step="0.01"
                {...register("company.total_employer_tax_rate", { valueAsNumber: true })}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-300 focus:outline-none focus:border-teal-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Benefícios Mensais (VR/VT/Saúde)</label>
              <input
                type="number"
                {...register("company.benefits", { valueAsNumber: true })}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-300 focus:outline-none focus:border-teal-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Custos Fixos da Empresa</label>
              <input
                type="number"
                {...register("company.fixed_costs", { valueAsNumber: true })}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-300 focus:outline-none focus:border-teal-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Custo de Retrabalho por Erro</label>
              <input
                type="number"
                {...register("company.rework_cost_per_error", { valueAsNumber: true })}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-300 focus:outline-none focus:border-teal-500"
              />
            </div>
          </div>
        )}
      </div>

      {/* 4. Pricing (Optional toggler, depends on company) */}
      {showCompany && (
        <div className="pt-4 border-t border-slate-800">
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={showPricing}
              onChange={(e) => {
                setShowPricing(e.target.checked);
                setValue("pricingEnabled", e.target.checked);
              }}
              className="rounded border-slate-800 bg-slate-950 text-teal-500 focus:ring-0 focus:ring-offset-0"
            />
            <span className="text-sm font-semibold tracking-wide text-teal-400 uppercase">
              🏷️ Ativar Precificação do Produto (Opcional)
            </span>
          </label>

          {showPricing && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 bg-slate-950/40 p-4 rounded-xl border border-slate-800/60">
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Margem Desejada (Ex: 0.30 para 30%)</label>
                <input
                  type="number"
                  step="0.01"
                  {...register("pricing.desired_margin", { valueAsNumber: true })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-300 focus:outline-none focus:border-teal-500"
                />
                {formErrors.pricing?.desired_margin && (
                  <span className="text-[11px] text-red-500">{formErrors.pricing.desired_margin.message}</span>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Actions */}
      <div className="pt-6 border-t border-slate-800 flex justify-end">
        <button
          type="submit"
          disabled={isLoading}
          className="bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600 text-slate-950 font-bold px-6 py-2.5 rounded-lg shadow-lg hover:shadow-teal-500/10 active:scale-95 transition-all text-sm disabled:opacity-50"
        >
          {isLoading ? "Simulando..." : "🚀 Rodar Simulação"}
        </button>
      </div>
    </form>
  );
}
