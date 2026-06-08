from typing import Any

from pydantic import BaseModel, Field, model_validator

from app.modules.company.schemas import CompanyCostResult, CompanyInput
from app.modules.pricing.schemas import PricingInput, PricingResult
from app.modules.schedule.schemas import ScheduleInput


class WorkerInput(BaseModel):
    job_type: str = "office"
    job_energy_cost_per_hour: float = 5.0
    monthly_salary: float = 0.0
    productivity_level: int = Field(default=5, ge=1, le=10)
    experience_level: int = Field(default=5, ge=1, le=10)
    sleep_hours: float = 7.0
    sleep_quality_factor: float = 1.0
    commute_hours: float = 0.0
    base_output_per_hour: float = 1.0
    base_error_rate: float = 0.05

class SimulationInput(BaseModel):
    period_days: int = Field(..., ge=1, le=365)
    worker: WorkerInput
    schedule: ScheduleInput
    company: CompanyInput | None = None
    pricing: PricingInput | None = None

class DailySimulationResult(BaseModel):
    day: int
    is_workday: bool
    is_rest_day: bool
    is_vacation: bool
    hours_worked: float
    hours_slept: float
    commute_hours: float
    energy_start: float
    energy_end: float
    burnout: float
    gross_output: float
    net_output: float
    error_rate: float
    free_time: float

class SimulationSummary(BaseModel):
    average_energy: float
    final_energy: float
    burnout: float
    gross_output: float
    net_output: float
    average_error_rate: float
    total_hours_worked: float
    total_free_time: float

class SimulationResult(BaseModel):
    summary: SimulationSummary
    daily_results: list[DailySimulationResult]
    company: CompanyCostResult | None = None
    pricing: PricingResult | None = None



class ScenarioInput(BaseModel):
    name: str = Field(..., min_length=1)
    simulation: SimulationInput

    @model_validator(mode="before")
    @classmethod
    def trim_name(cls, data: dict[str, Any]) -> dict[str, Any]:
        if isinstance(data, dict) and "name" in data and isinstance(data["name"], str):
            data["name"] = data["name"].strip()
        return data


class CompareSimulationsInput(BaseModel):
    baseline_scenario_name: str | None = None
    scenarios: list[ScenarioInput] = Field(..., min_length=2)

    @model_validator(mode="after")
    def validate_scenarios(self) -> "CompareSimulationsInput":
        names = []
        for s in self.scenarios:
            if not s.name:
                raise ValueError("Scenario name cannot be empty")
            names.append(s.name)
        if len(names) != len(set(names)):
            raise ValueError("Scenario names must be unique")
        if self.baseline_scenario_name is not None:
            self.baseline_scenario_name = self.baseline_scenario_name.strip()
            if self.baseline_scenario_name not in names:
                raise ValueError("baseline_scenario_name must exist in scenarios")
        return self


class ScenarioSummaryComparison(BaseModel):
    name: str
    summary: SimulationSummary
    daily_results: list[DailySimulationResult]
    company: CompanyCostResult | None = None
    pricing: PricingResult | None = None


class MetricDelta(BaseModel):
    metric: str
    baseline_value: float | None = None
    scenario_value: float | None = None
    absolute_difference: float | None = None
    percentage_difference: float | None = None
    direction: str  # "higher", "lower", "same", "not_comparable"


class ScenarioDelta(BaseModel):
    scenario_name: str
    compared_to: str
    deltas: list[MetricDelta]


class CompareSimulationsResult(BaseModel):
    baseline_scenario_name: str
    scenarios: list[ScenarioSummaryComparison]
    deltas: list[ScenarioDelta]


