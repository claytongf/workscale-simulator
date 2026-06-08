from pydantic import BaseModel, Field


class EmployerTaxRates(BaseModel):
    inss: float = Field(0.0, ge=0.0)
    fgts: float = Field(0.0, ge=0.0)
    rat_sat: float = Field(0.0, ge=0.0)
    third_party: float = Field(0.0, ge=0.0)
    social_security: float = Field(0.0, ge=0.0)
    medicare: float = Field(0.0, ge=0.0)
    futa: float = Field(0.0, ge=0.0)
    suta: float = Field(0.0, ge=0.0)
    national_insurance: float = Field(0.0, ge=0.0)
    other: float = Field(0.0, ge=0.0)


class BenefitDefaults(BaseModel):
    transport: float = Field(0.0, ge=0.0)
    meal: float = Field(0.0, ge=0.0)
    health: float = Field(0.0, ge=0.0)
    other: float = Field(0.0, ge=0.0)


class CountryPreset(BaseModel):
    key: str = Field(..., min_length=1)
    country_code: str = Field(..., min_length=1)
    country_name: str = Field(..., min_length=1)
    preset_name: str = Field(..., min_length=1)
    currency: str = Field(..., min_length=1)
    default_weekly_hours: float = Field(..., gt=0.0)
    default_workdays_per_week: int = Field(..., ge=1, le=7)
    paid_vacation_days_per_year: int = Field(..., ge=0)
    public_holidays_per_year: int = Field(..., ge=0)
    employer_tax_rates: EmployerTaxRates
    benefit_defaults: BenefitDefaults
    overtime_rules_summary: str = Field(..., min_length=1)
    notes: str = Field(..., min_length=1)
    source_label: str = Field(..., min_length=1)
    source_url: str = Field(..., min_length=1)
    last_updated: str = Field(..., min_length=1)
    is_estimate: bool = Field(default=True)
    editable: bool = Field(default=True)


class CountryPresetSummary(BaseModel):
    key: str
    country_code: str
    country_name: str
    preset_name: str
    currency: str
