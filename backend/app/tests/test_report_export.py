import pytest
from pydantic import ValidationError

from app.modules.report.schemas import ReportExportRequest
from app.modules.report.service import (
    export_csv,
    export_json,
    export_markdown,
    generate_report_data,
)
from app.modules.schedule.schemas import ScheduleInput
from app.modules.simulation.schemas import SimulationInput, WorkerInput


@pytest.fixture
def valid_simulation_input():
    return SimulationInput(
        period_days=3,
        worker=WorkerInput(job_type="office", job_energy_cost_per_hour=5.0),
        schedule=ScheduleInput(type="5x2", hours_per_day=8.0),
    )


def test_invalid_request_rejected():
    # Title empty should raise validation error (after trim)
    with pytest.raises(ValidationError):
        ReportExportRequest(title="   ", simulation=None, comparison=None)

    # Both simulation and comparison None should raise validation error
    with pytest.raises(ValidationError):
        ReportExportRequest(title="Test", simulation=None, comparison=None)


def test_json_export_contents(valid_simulation_input):
    request = ReportExportRequest(
        title="Custom Test Report",
        simulation=valid_simulation_input,
        include_daily_results=True,
        include_assumptions=True,
        include_limitations=True,
    )
    report_data = generate_report_data(request)
    response = export_json(request, report_data)

    assert "custom_test_report" in response.filename
    assert response.data["project_name"] == "WorkScale Simulator"
    assert response.data["report_title"] == "Custom Test Report"
    assert "worker_assumptions" in response.data
    assert "summary_results" in response.data
    assert response.data["ethics_and_limitations_note"] is not None


def test_csv_export_with_daily_results(valid_simulation_input):
    request = ReportExportRequest(
        title="CSV Report",
        simulation=valid_simulation_input,
        include_daily_results=True,
    )
    report_data = generate_report_data(request)
    response = export_csv(request, report_data)
    content = response.content

    assert "section,key,value" in content
    assert "summary,average_energy" in content
    # Should include daily rows header
    assert "section,day,is_workday,is_rest_day" in content
    # Daily row itself
    assert "daily,1," in content


def test_csv_export_without_daily_results(valid_simulation_input):
    request = ReportExportRequest(
        title="CSV Report",
        simulation=valid_simulation_input,
        include_daily_results=False,
    )
    report_data = generate_report_data(request)
    response = export_csv(request, report_data)
    content = response.content

    assert "summary,average_energy" in content
    assert "daily,1," not in content


def test_markdown_export_headings_and_limitations(valid_simulation_input):
    request = ReportExportRequest(
        title="MD Report",
        simulation=valid_simulation_input,
        include_daily_results=True,
        include_limitations=True,
    )
    report_data = generate_report_data(request)
    response = export_markdown(request, report_data)
    content = response.content

    assert "# MD Report" in content
    assert "## Overview" in content
    assert "## Scenario Inputs" in content
    assert "## Summary Results" in content
    assert "## Daily Results" in content
    assert "## Limitations" in content
    assert "This report is educational and experimental" in content
