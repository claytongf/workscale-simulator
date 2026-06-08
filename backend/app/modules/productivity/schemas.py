from pydantic import BaseModel, Field


class ProductivityConfig(BaseModel):
    base_output_per_hour: float = Field(1.0, ge=0.0)
    worker_productivity_level: int = Field(5, ge=1, le=10)
    experience_level: int = Field(5, ge=1, le=10)
    tooling_factor: float = Field(1.0, ge=0.0)
    environment_factor: float = Field(1.0, ge=0.0)
    base_error_rate: float = Field(0.05, ge=0.0, le=1.0)
