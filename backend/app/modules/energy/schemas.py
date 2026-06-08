from pydantic import BaseModel, Field


class EnergyConfig(BaseModel):
    job_energy_cost_per_hour: float = Field(5.0, ge=0.0)
    overtime_multiplier: float = Field(1.0, ge=0.0)
    night_shift_multiplier: float = Field(1.0, ge=0.0)
    stress_multiplier: float = Field(1.0, ge=0.0)
    commute_energy_cost_per_hour: float = Field(3.0, ge=0.0)
    commute_stress_multiplier: float = Field(1.0, ge=0.0)
    sleep_recovery_rate: float = Field(12.0, ge=0.0)
    sleep_quality_factor: float = Field(1.0, ge=0.0, le=2.0)
    rest_recovery_rate: float = Field(2.0, ge=0.0)
    rest_quality_factor: float = Field(1.0, ge=0.0)
    vacation_quality: float = Field(1.0, ge=0.0)
    vacation_energy_recovery_rate: float = Field(8.0, ge=0.0)
    domestic_cost: float = Field(5.0, ge=0.0)
    stress_cost: float = Field(0.0, ge=0.0)
    leisure_recovery: float = Field(0.0, ge=0.0)
