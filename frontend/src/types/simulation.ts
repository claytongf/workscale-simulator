export type WorkerInput = {
  job_type: string;
  job_energy_cost_per_hour: number;
  monthly_salary: number;
  productivity_level: number;
  experience_level: number;
  sleep_hours: number;
  sleep_quality_factor: number;
  commute_hours: number;
  base_output_per_hour: number;
  base_error_rate: number;
};

export type ScheduleInput = {
  type: "6x1" | "5x2" | "4x3" | "12x36" | "custom";
  hours_per_day: number;
  vacation_days_per_year: number;
  workdays_per_week?: number;
};

export type CompanyInput = {
  number_of_employees: number;
  gross_salary: number;
  total_employer_tax_rate: number;
  benefits: number;
  vacation_provision_rate: number;
  vacation_bonus_provision: number;
  thirteenth_salary_rate: number;
  training_cost: number;
  absenteeism_cost: number;
  turnover_cost: number;
  equipment_cost: number;
  fixed_costs: number;
  variable_costs: number;
  material_costs: number;
  operational_costs: number;
  taxes_on_revenue: number;
  rework_cost_per_error: number;
};

export type PricingInput = {
  desired_margin: number;
};

export type SimulationInput = {
  period_days: number;
  worker: WorkerInput;
  schedule: ScheduleInput;
  company?: CompanyInput;
  pricing?: PricingInput;
};

export type DailySimulationResult = {
  day: number;
  is_workday: boolean;
  is_rest_day: boolean;
  is_vacation: boolean;
  hours_worked: number;
  hours_slept: number;
  commute_hours: number;
  energy_start: number;
  energy_end: number;
  burnout: number;
  gross_output: number;
  net_output: number;
  error_rate: number;
  free_time: number;
};

export type SimulationSummary = {
  average_energy: number;
  final_energy: number;
  burnout: number;
  gross_output: number;
  net_output: number;
  average_error_rate: number;
  total_hours_worked: number;
  total_free_time: number;
};

export type CompanyCostResult = {
  employer_taxes: number;
  vacation_provision: number;
  thirteenth_salary_provision: number;
  employee_total_cost: number;
  rework_costs: number;
  company_monthly_cost: number;
};

export type PricingResult = {
  unit_cost: number;
  final_price: number;
};

export type SimulationResult = {
  summary: SimulationSummary;
  daily_results: DailySimulationResult[];
  company?: CompanyCostResult;
  pricing?: PricingResult;
};

export type ScenarioInput = {
  name: string;
  simulation: SimulationInput;
};

export type MetricDelta = {
  metric: string;
  baseline_value: number | null;
  scenario_value: number | null;
  absolute_difference: number | null;
  percentage_difference: number | null;
  direction: "higher" | "lower" | "same" | "not_comparable";
};

export type ScenarioDelta = {
  scenario_name: string;
  compared_to: string;
  deltas: MetricDelta[];
};

export type ScenarioSummaryComparison = {
  name: string;
  summary: SimulationSummary;
  daily_results: DailySimulationResult[];
  company?: CompanyCostResult;
  pricing?: PricingResult;
};

export type AnimatedScenario = {
  name: string;
  result: SimulationResult;
};

export type CompareSimulationsInput = {
  baseline_scenario_name?: string;
  scenarios: ScenarioInput[];
};

export type CompareSimulationsResult = {
  baseline_scenario_name: string;
  scenarios: ScenarioSummaryComparison[];
  deltas: ScenarioDelta[];
};


export type EmployerTaxRates = {
  inss: number;
  fgts: number;
  rat_sat: number;
  third_party: number;
  social_security: number;
  medicare: number;
  futa: number;
  suta: number;
  national_insurance: number;
  other: number;
};

export type BenefitDefaults = {
  transport: number;
  meal: number;
  health: number;
  other: number;
};

export type CountryPreset = {
  key: string;
  country_code: string;
  country_name: string;
  preset_name: string;
  currency: string;
  default_weekly_hours: number;
  default_workdays_per_week: number;
  paid_vacation_days_per_year: number;
  public_holidays_per_year: number;
  employer_tax_rates: EmployerTaxRates;
  benefit_defaults: BenefitDefaults;
  overtime_rules_summary: string;
  notes: string;
  source_label: string;
  source_url: string;
  last_updated: string;
  is_estimate: boolean;
  editable: boolean;
};

export type CountryPresetSummary = {
  key: string;
  country_code: string;
  country_name: string;
  preset_name: string;
  currency: string;
};

