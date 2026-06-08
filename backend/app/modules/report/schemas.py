from typing import Any

from pydantic import BaseModel, Field, model_validator

from app.modules.simulation.schemas import CompareSimulationsInput, SimulationInput


class ReportExportRequest(BaseModel):
    title: str = Field(default="WorkScale Simulator Report")
    description: str | None = None
    simulation: SimulationInput | None = None
    comparison: CompareSimulationsInput | None = None
    include_daily_results: bool = True
    include_assumptions: bool = True
    include_limitations: bool = True

    @model_validator(mode="before")
    @classmethod
    def trim_title(cls, data: dict[str, Any]) -> dict[str, Any]:
        if (
            isinstance(data, dict)
            and "title" in data
            and isinstance(data["title"], str)
        ):
            data["title"] = data["title"].strip()
        return data

    @model_validator(mode="after")
    def validate_request(self) -> "ReportExportRequest":
        if not self.title:
            raise ValueError("title must not be empty")
        if self.simulation is None and self.comparison is None:
            raise ValueError("Either simulation or comparison must be provided")
        return self


class JsonReportResponse(BaseModel):
    filename: str
    content_type: str = "application/json"
    data: dict[str, Any]


class TextReportResponse(BaseModel):
    filename: str
    content_type: str
    content: str
