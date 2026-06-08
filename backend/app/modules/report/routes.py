from fastapi import APIRouter

from app.modules.report.schemas import (
    JsonReportResponse,
    ReportExportRequest,
    TextReportResponse,
)
from app.modules.report.service import (
    export_csv,
    export_json,
    export_markdown,
    generate_report_data,
)

router = APIRouter(prefix="/api/reports", tags=["reports"])


@router.post("/export/json", response_model=JsonReportResponse)
def export_report_json(request: ReportExportRequest) -> JsonReportResponse:
    report_data = generate_report_data(request)
    return export_json(request, report_data)


@router.post("/export/csv", response_model=TextReportResponse)
def export_report_csv(request: ReportExportRequest) -> TextReportResponse:
    report_data = generate_report_data(request)
    return export_csv(request, report_data)


@router.post("/export/markdown", response_model=TextReportResponse)
def export_report_markdown(request: ReportExportRequest) -> TextReportResponse:
    report_data = generate_report_data(request)
    return export_markdown(request, report_data)
