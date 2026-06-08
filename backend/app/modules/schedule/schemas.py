from typing import Literal

from pydantic import BaseModel, Field


class ScheduleInput(BaseModel):
    type: Literal["6x1", "5x2", "4x3", "12x36", "custom"]
    hours_per_day: float = Field(..., ge=0.0, le=24.0)
    vacation_days_per_year: int = Field(0, ge=0)
    workdays_per_week: int | None = Field(None, ge=1, le=7)
