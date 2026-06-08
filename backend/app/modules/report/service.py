import csv
import io
from datetime import UTC, datetime
from typing import Any

from app.modules.report.schemas import (
    JsonReportResponse,
    ReportExportRequest,
    TextReportResponse,
)
from app.modules.simulation.comparison_service import compare_scenarios
from app.modules.simulation.service import simulate_period

LIMITATIONS_NOTE = (
    "This report is educational and experimental. Results depend on "
    "user-provided assumptions and simplified models. It does not replace "
    "legal, labor, accounting, tax, medical, psychological or economic advice."
)


def generate_report_data(request: ReportExportRequest) -> dict[str, Any]:
    generated_at = datetime.now(UTC).strftime("%Y-%m-%dT%H:%M:%SZ")
    report: dict[str, Any] = {
        "project_name": "WorkScale Simulator",
        "report_title": request.title,
        "description": request.description,
        "generated_at": generated_at,
        "ethics_and_limitations_note": (
            LIMITATIONS_NOTE if request.include_limitations else None
        ),
    }

    if request.simulation:
        sim_result = simulate_period(request.simulation)
        report["type"] = "simulation"

        if request.include_assumptions:
            report["worker_assumptions"] = request.simulation.worker.model_dump()
            report["schedule_assumptions"] = (
                request.simulation.schedule.model_dump()
            )
            if request.simulation.company:
                report["company_cost_assumptions"] = (
                    request.simulation.company.model_dump()
                )
            if request.simulation.pricing:
                report["pricing_assumptions"] = (
                    request.simulation.pricing.model_dump()
                )

        report["summary_results"] = sim_result.summary.model_dump()
        if sim_result.company:
            report["company_results"] = sim_result.company.model_dump()
        if sim_result.pricing:
            report["pricing_results"] = sim_result.pricing.model_dump()

        if request.include_daily_results:
            report["daily_results"] = [
                day.model_dump() for day in sim_result.daily_results
            ]

    elif request.comparison:
        comp_result = compare_scenarios(request.comparison)
        report["type"] = "comparison"
        report["baseline_scenario_name"] = comp_result.baseline_scenario_name

        if request.include_assumptions:
            report["scenarios_assumptions"] = [
                {
                    "name": s.name,
                    "worker": s.simulation.worker.model_dump(),
                    "schedule": s.simulation.schedule.model_dump(),
                    "company": (
                        s.simulation.company.model_dump()
                        if s.simulation.company
                        else None
                    ),
                    "pricing": (
                        s.simulation.pricing.model_dump()
                        if s.simulation.pricing
                        else None
                    ),
                }
                for s in request.comparison.scenarios
            ]

        report["scenarios_results"] = [
            {
                "name": s.name,
                "summary": s.summary.model_dump(),
                "company": s.company.model_dump() if s.company else None,
                "pricing": s.pricing.model_dump() if s.pricing else None,
            }
            for s in comp_result.scenarios
        ]
        report["comparison_deltas"] = [
            {
                "scenario_name": d.scenario_name,
                "compared_to": d.compared_to,
                "deltas": [m.model_dump() for m in d.deltas],
            }
            for d in comp_result.deltas
        ]

    return report


def export_json(
    request: ReportExportRequest, data: dict[str, Any]
) -> JsonReportResponse:
    safe_title = "".join(
        [c if c.isalnum() else "_" for c in request.title]
    ).lower()
    filename = f"{safe_title}_{data['generated_at'].replace(':', '-')}.json"
    return JsonReportResponse(
        filename=filename, content_type="application/json", data=data
    )


def export_csv(
    request: ReportExportRequest, data: dict[str, Any]
) -> TextReportResponse:
    safe_title = "".join(
        [c if c.isalnum() else "_" for c in request.title]
    ).lower()
    filename = f"{safe_title}_{data['generated_at'].replace(':', '-')}.csv"

    output = io.StringIO()
    writer = csv.writer(output)

    if data["type"] == "simulation":
        writer.writerow(["section", "key", "value"])
        writer.writerow(["metadata", "project_name", data["project_name"]])
        writer.writerow(["metadata", "report_title", data["report_title"]])
        writer.writerow(["metadata", "generated_at", data["generated_at"]])

        for k, v in data["summary_results"].items():
            writer.writerow(["summary", k, v])

        if "daily_results" in data and data["daily_results"]:
            writer.writerow([])
            daily_keys = list(data["daily_results"][0].keys())
            writer.writerow(["section"] + daily_keys)
            for day in data["daily_results"]:
                writer.writerow(["daily"] + [day[k] for k in daily_keys])

    elif data["type"] == "comparison":
        writer.writerow(["section", "scenario_name", "metric", "value"])
        writer.writerow(["metadata", "", "project_name", data["project_name"]])
        writer.writerow(["metadata", "", "report_title", data["report_title"]])
        writer.writerow(["metadata", "", "generated_at", data["generated_at"]])
        writer.writerow(
            ["metadata", "", "baseline_scenario_name", data["baseline_scenario_name"]]
        )

        for s in data["scenarios_results"]:
            for k, v in s["summary"].items():
                writer.writerow(["summary", s["name"], k, v])

        writer.writerow([])
        writer.writerow(
            [
                "section",
                "scenario_name",
                "compared_to",
                "metric",
                "baseline_value",
                "scenario_value",
                "absolute_difference",
                "percentage_difference",
                "direction",
            ]
        )
        for d in data["comparison_deltas"]:
            for m in d["deltas"]:
                writer.writerow(
                    [
                        "delta",
                        d["scenario_name"],
                        d["compared_to"],
                        m["metric"],
                        m["baseline_value"],
                        m["scenario_value"],
                        m["absolute_difference"],
                        m["percentage_difference"],
                        m["direction"],
                    ]
                )

    return TextReportResponse(
        filename=filename, content_type="text/csv", content=output.getvalue()
    )


def export_markdown(
    request: ReportExportRequest, data: dict[str, Any]
) -> TextReportResponse:
    safe_title = "".join(
        [c if c.isalnum() else "_" for c in request.title]
    ).lower()
    filename = f"{safe_title}_{data['generated_at'].replace(':', '-')}.md"

    md = []
    md.append(f"# {data['report_title']}")
    md.append("")
    md.append("## Overview")
    md.append(f"- **Project**: {data['project_name']}")
    md.append(f"- **Generated At**: {data['generated_at']}")
    if data.get("description"):
        md.append(f"- **Description**: {data['description']}")
    md.append("")

    if data["type"] == "simulation":
        if request.include_assumptions:
            md.append("## Scenario Inputs")

            md.append("### Worker Assumptions")
            for k, v in data["worker_assumptions"].items():
                md.append(f"- **{k}**: {v}")
            md.append("")

            md.append("### Schedule Assumptions")
            for k, v in data["schedule_assumptions"].items():
                md.append(f"- **{k}**: {v}")
            md.append("")

            if "company_cost_assumptions" in data:
                md.append("### Company Cost Assumptions")
                for k, v in data["company_cost_assumptions"].items():
                    md.append(f"- **{k}**: {v}")
                md.append("")

            if "pricing_assumptions" in data:
                md.append("### Pricing Assumptions")
                for k, v in data["pricing_assumptions"].items():
                    md.append(f"- **{k}**: {v}")
                md.append("")

        md.append("## Summary Results")
        for k, v in data["summary_results"].items():
            if isinstance(v, float):
                md.append(f"- **{k.replace('_', ' ').title()}**: {v:.2f}")
            else:
                md.append(f"- **{k.replace('_', ' ').title()}**: {v}")
        md.append("")

        if "daily_results" in data and data["daily_results"]:
            md.append("## Daily Results")
            daily_keys = [
                "day",
                "energy_start",
                "energy_end",
                "burnout",
                "gross_output",
                "net_output",
                "error_rate",
                "free_time",
            ]
            headers = [k.replace("_", " ").title() for k in daily_keys]
            md.append("| " + " | ".join(headers) + " |")
            md.append("| " + " | ".join(["---"] * len(daily_keys)) + " |")
            for day in data["daily_results"]:
                row_vals = []
                for k in daily_keys:
                    val = day[k]
                    if isinstance(val, float):
                        row_vals.append(f"{val:.2f}")
                    elif isinstance(val, bool):
                        row_vals.append("Sim" if val else "Não")
                    else:
                        row_vals.append(str(val))
                md.append("| " + " | ".join(row_vals) + " |")
            md.append("")

    elif data["type"] == "comparison":
        if request.include_assumptions:
            md.append("## Scenario Inputs")
            for sa in data["scenarios_assumptions"]:
                md.append(f"### Scenario: {sa['name']}")
                md.append("**Worker**:")
                for k, v in sa["worker"].items():
                    md.append(f"- **{k}**: {v}")
                md.append("**Schedule**:")
                for k, v in sa["schedule"].items():
                    md.append(f"- **{k}**: {v}")
                md.append("")

        md.append("## Summary Results")
        for sr in data["scenarios_results"]:
            md.append(f"### {sr['name']}")
            for k, v in sr["summary"].items():
                if isinstance(v, float):
                    md.append(f"- **{k.replace('_', ' ').title()}**: {v:.2f}")
                else:
                    md.append(f"- **{k.replace('_', ' ').title()}**: {v}")
            md.append("")

        md.append("## Comparison Deltas")
        for d in data["comparison_deltas"]:
            md.append(
                f"### Scenario: {d['scenario_name']} (Compared to {d['compared_to']})"
            )
            md.append(
                "| Metric | Baseline | Scenario | Absolute Diff | "
                "Percentage Diff | Direction |"
            )
            md.append("| --- | --- | --- | --- | --- | --- |")
            for m in d["deltas"]:
                baseline_val = (
                    f"{m['baseline_value']:.2f}"
                    if m["baseline_value"] is not None
                    else "N/A"
                )
                scenario_val = (
                    f"{m['scenario_value']:.2f}"
                    if m["scenario_value"] is not None
                    else "N/A"
                )
                abs_diff = (
                    f"{m['absolute_difference']:.2f}"
                    if m["absolute_difference"] is not None
                    else "N/A"
                )
                pct_diff = (
                    f"{m['percentage_difference']:.2f}%"
                    if m["percentage_difference"] is not None
                    else "N/A"
                )
                md.append(
                    f"| {m['metric']} | {baseline_val} | {scenario_val} | "
                    f"{abs_diff} | {pct_diff} | {m['direction']} |"
                )
            md.append("")

    if request.include_limitations and data["ethics_and_limitations_note"]:
        md.append("## Limitations")
        md.append(data["ethics_and_limitations_note"])
        md.append("")

    return TextReportResponse(
        filename=filename, content_type="text/markdown", content="\n".join(md)
    )
