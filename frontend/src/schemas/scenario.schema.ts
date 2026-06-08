import { z } from "zod";

export const WorkerInputSchema = z.object({
  job_type: z.string().default("office"),
  job_energy_cost_per_hour: z.coerce.number().min(0).max(24).default(5.0),
  monthly_salary: z.coerce.number().min(0).default(0.0),
  productivity_level: z.coerce.number().int().min(1).max(10).default(5),
  experience_level: z.coerce.number().int().min(1).max(10).default(5),
  sleep_hours: z.coerce.number().min(0).max(24).default(7.0),
  sleep_quality_factor: z.coerce.number().min(0).max(2).default(1.0),
  commute_hours: z.coerce.number().min(0).max(24).default(0.0),
  base_output_per_hour: z.coerce.number().min(0).default(1.0),
  base_error_rate: z.coerce.number().min(0).max(1).default(0.05),
});

export const ScheduleInputSchema = z.object({
  type: z.enum(["6x1", "5x2", "4x3", "12x36", "custom"]).default("5x2"),
  hours_per_day: z.coerce.number().min(0).max(24).default(8.0),
  vacation_days_per_year: z.coerce.number().int().min(0).default(0),
  workdays_per_week: z.coerce.number().int().min(1).max(7).optional(),
});

export const CompanyInputSchema = z.object({
  number_of_employees: z.coerce.number().int().min(1).default(1),
  gross_salary: z.coerce.number().min(0).default(0.0),
  total_employer_tax_rate: z.coerce.number().min(0).default(0.0),
  benefits: z.coerce.number().min(0).default(0.0),
  vacation_provision_rate: z.coerce.number().min(0).default(0.0833),
  vacation_bonus_provision: z.coerce.number().min(0).default(0.0),
  thirteenth_salary_rate: z.coerce.number().min(0).default(0.0833),
  training_cost: z.coerce.number().min(0).default(0.0),
  absenteeism_cost: z.coerce.number().min(0).default(0.0),
  turnover_cost: z.coerce.number().min(0).default(0.0),
  equipment_cost: z.coerce.number().min(0).default(0.0),
  fixed_costs: z.coerce.number().min(0).default(0.0),
  variable_costs: z.coerce.number().min(0).default(0.0),
  material_costs: z.coerce.number().min(0).default(0.0),
  operational_costs: z.coerce.number().min(0).default(0.0),
  taxes_on_revenue: z.coerce.number().min(0).default(0.0),
  rework_cost_per_error: z.coerce.number().min(0).default(0.0),
});

export const PricingInputSchema = z.object({
  desired_margin: z.coerce.number().min(0).max(0.99).default(0.30),
});

export const SimulationInputSchema = z.object({
  period_days: z.coerce.number().int().min(1).max(365).default(30),
  worker: WorkerInputSchema,
  schedule: ScheduleInputSchema,
  companyEnabled: z.boolean().default(false),
  company: CompanyInputSchema.optional(),
  pricingEnabled: z.boolean().default(false),
  pricing: PricingInputSchema.optional(),
});
export type SimulationInputForm = z.infer<typeof SimulationInputSchema>;
