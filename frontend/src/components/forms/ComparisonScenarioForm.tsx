import React from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { WorkerInputSchema, ScheduleInputSchema } from "../../schemas/scenario.schema";
import { Plus, Trash2 } from "lucide-react";

const ScenarioComparisonSchema = z.object({
  scenarios: z.array(
    z.object({
      name: z.string().min(1, "O nome do cenário é obrigatório"),
      period_days: z.coerce.number().int().min(1).max(365).default(30),
      worker: WorkerInputSchema,
      schedule: ScheduleInputSchema,
    })
  )
  .min(2, "Você precisa de pelo menos 2 cenários para comparar")
  .max(3, "O máximo de cenários para comparação simultânea é 3"),
});

type ScenarioComparisonForm = z.infer<typeof ScenarioComparisonSchema>;

interface ComparisonScenarioFormProps {
  onSubmit: (data: ScenarioComparisonForm) => void;
  isLoading: boolean;
}

export default function ComparisonScenarioForm({ onSubmit, isLoading }: ComparisonScenarioFormProps) {
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<any>({
    resolver: zodResolver(ScenarioComparisonSchema),
    defaultValues: {
      scenarios: [
        {
          name: "Escala 5x2 (Padrão)",
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
        },
        {
          name: "Escala 6x1",
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
            type: "6x1",
            hours_per_day: 8.0,
            vacation_days_per_year: 0,
          },
        },
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "scenarios",
  });

  const formErrors = errors as any;

  const handleAddScenario = () => {
    if (fields.length >= 3) return;

    // Default template for a 3rd scenario (e.g., scale 4x3)
    append({
      name: "Escala 4x3",
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
        type: "4x3",
        hours_per_day: 8.0,
        vacation_days_per_year: 0,
      },
    });
  };

  const gridColsClass = fields.length === 3 ? "grid-cols-1 lg:grid-cols-3" : "grid-cols-1 lg:grid-cols-2";

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      {/* Dynamic Scenarios Grid */}
      <div className={`grid gap-8 ${gridColsClass}`}>
        {fields.map((field, index) => (
          <div
            key={field.id}
            className="space-y-6 bg-slate-900/40 border border-slate-800/80 p-6 rounded-2xl backdrop-blur-md relative"
          >
            <div className="border-b border-slate-800 pb-4 flex items-center justify-between">
              <div className="flex-1 mr-2">
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
                  Nome do Cenário {index === 0 ? "A" : index === 1 ? "B" : "C"}
                </label>
                <input
                  type="text"
                  {...register(`scenarios.${index}.name` as const)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-100 font-bold focus:outline-none focus:border-teal-500"
                />
                {formErrors.scenarios?.[index]?.name && (
                  <span className="text-xs text-red-500 mt-1 block">
                    {formErrors.scenarios[index]?.name?.message}
                  </span>
                )}
              </div>

              {/* Remove scenario button (minimum of 2 scenarios required) */}
              {fields.length > 2 && (
                <button
                  type="button"
                  onClick={() => remove(index)}
                  className="mt-4 p-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 hover:border-red-500/30 rounded-lg transition-all active:scale-95 self-center"
                  title="Remover Cenário"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Fields list */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Duração (dias)</label>
                <select
                  {...register(`scenarios.${index}.period_days` as const, { valueAsNumber: true })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-300 focus:outline-none focus:border-teal-500"
                >
                  <option value={7}>7 dias</option>
                  <option value={30}>30 dias</option>
                  <option value={90}>90 dias</option>
                  <option value={365}>365 dias</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Escala</label>
                <select
                  {...register(`scenarios.${index}.schedule.type` as const)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-300 focus:outline-none focus:border-teal-500"
                >
                  <option value="5x2">5x2</option>
                  <option value="6x1">6x1</option>
                  <option value="4x3">4x3</option>
                  <option value="12x36">12x36</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Horas por Dia</label>
                <input
                  type="number"
                  step="0.5"
                  {...register(`scenarios.${index}.schedule.hours_per_day` as const, { valueAsNumber: true })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-300 focus:outline-none focus:border-teal-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Produtividade (1-10)</label>
                <input
                  type="number"
                  {...register(`scenarios.${index}.worker.productivity_level` as const, { valueAsNumber: true })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-300 focus:outline-none focus:border-teal-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Horas de Sono</label>
                <input
                  type="number"
                  step="0.5"
                  {...register(`scenarios.${index}.worker.sleep_hours` as const, { valueAsNumber: true })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-300 focus:outline-none focus:border-teal-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Horas Deslocamento</label>
                <input
                  type="number"
                  step="0.5"
                  {...register(`scenarios.${index}.worker.commute_hours` as const, { valueAsNumber: true })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-300 focus:outline-none focus:border-teal-500"
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Control Buttons: Add Scenario and Submit */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
        {fields.length < 3 && (
          <button
            type="button"
            onClick={handleAddScenario}
            className="w-full sm:w-auto flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 text-teal-400 border border-slate-800 hover:border-slate-700 font-bold px-6 py-3 rounded-xl transition-all active:scale-95 text-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Adicionar Cenário</span>
          </button>
        )}

        <button
          type="submit"
          disabled={isLoading}
          className="w-full sm:w-auto bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600 text-slate-950 font-bold px-8 py-3 rounded-xl shadow-lg hover:shadow-teal-500/10 active:scale-95 transition-all text-sm disabled:opacity-50"
        >
          {isLoading ? "Comparando..." : "📊 Comparar Cenários"}
        </button>
      </div>
    </form>
  );
}
