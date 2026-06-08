from pydantic import BaseModel, Field


class CompanyInput(BaseModel):
    number_of_employees: int = Field(default=1, ge=1)
    gross_salary: float = Field(default=0.0, ge=0.0)
    total_employer_tax_rate: float = Field(default=0.0, ge=0.0)
    benefits: float = Field(default=0.0, ge=0.0)
    vacation_provision_rate: float = Field(default=0.0, ge=0.0)
    vacation_bonus_provision: float = Field(default=0.0, ge=0.0)
    thirteenth_salary_rate: float = Field(default=0.0, ge=0.0)
    training_cost: float = Field(default=0.0, ge=0.0)
    absenteeism_cost: float = Field(default=0.0, ge=0.0)
    turnover_cost: float = Field(default=0.0, ge=0.0)
    equipment_cost: float = Field(default=0.0, ge=0.0)
    fixed_costs: float = Field(default=0.0, ge=0.0)
    variable_costs: float = Field(default=0.0, ge=0.0)
    material_costs: float = Field(default=0.0, ge=0.0)
    operational_costs: float = Field(default=0.0, ge=0.0)
    taxes_on_revenue: float = Field(default=0.0, ge=0.0)
    rework_cost_per_error: float = Field(default=0.0, ge=0.0)


class CompanyCostResult(BaseModel):
    employer_taxes: float
    vacation_provision: float
    thirteenth_salary_provision: float
    employee_total_cost: float
    rework_costs: float
    company_monthly_cost: float
