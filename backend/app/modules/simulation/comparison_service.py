from app.modules.simulation.schemas import (
    CompareSimulationsInput,
    CompareSimulationsResult,
    MetricDelta,
    ScenarioDelta,
    ScenarioSummaryComparison,
    SimulationResult,
)
from app.modules.simulation.service import simulate_period

METRICS = ["average_energy", "final_energy", "burnout", "gross_output", "net_output"]


def get_metric_value(result: SimulationResult, metric_name: str) -> float | None:
    return getattr(result.summary, metric_name, None)



def compute_metric_delta(
    metric_name: str, baseline_val: float | None, scenario_val: float | None
) -> MetricDelta:
    if baseline_val is None or scenario_val is None:
        return MetricDelta(
            metric=metric_name,
            baseline_value=baseline_val,
            scenario_value=scenario_val,
            absolute_difference=None,
            percentage_difference=None,
            direction="not_comparable",
        )

    abs_diff = scenario_val - baseline_val

    # Check direction
    if abs_diff > 1e-9:
        direction = "higher"
    elif abs_diff < -1e-9:
        direction = "lower"
    else:
        direction = "same"

    pct_diff = None
    if abs(baseline_val) < 1e-9:
        # Baseline is zero
        if abs(scenario_val) < 1e-9:
            # Both are zero
            pct_diff = 0.0
            direction = "same"
        else:
            pct_diff = None
            # direction is already set correctly based on abs_diff
    else:
        pct_diff = (abs_diff / abs(baseline_val)) * 100.0

    return MetricDelta(
        metric=metric_name,
        baseline_value=baseline_val,
        scenario_value=scenario_val,
        absolute_difference=abs_diff,
        percentage_difference=pct_diff,
        direction=direction,
    )


def compare_scenarios(input_data: CompareSimulationsInput) -> CompareSimulationsResult:
    scenario_results = []
    baseline_result = None
    baseline_name = input_data.baseline_scenario_name

    # If baseline name is not provided, default to the first scenario's name
    if not baseline_name and input_data.scenarios:
        baseline_name = input_data.scenarios[0].name

    for scenario in input_data.scenarios:
        res = simulate_period(scenario.simulation)
        scenario_results.append((scenario.name, res))
        if scenario.name == baseline_name:
            baseline_result = res

    scenarios_summary = []
    for name, res in scenario_results:
        scenarios_summary.append(
            ScenarioSummaryComparison(
                name=name,
                summary=res.summary,
                daily_results=res.daily_results,
                company=res.company,
                pricing=res.pricing,
            )
        )

    deltas = []
    for name, res in scenario_results:
        scenario_deltas = []
        for metric in METRICS:
            baseline_val = (
                get_metric_value(baseline_result, metric)
                if baseline_result
                else None
            )
            scenario_val = get_metric_value(res, metric)
            scenario_deltas.append(
                compute_metric_delta(metric, baseline_val, scenario_val)
            )

        deltas.append(
            ScenarioDelta(
                scenario_name=name,
                compared_to=baseline_name,
                deltas=scenario_deltas,
            )
        )

    return CompareSimulationsResult(
        baseline_scenario_name=baseline_name,
        scenarios=scenarios_summary,
        deltas=deltas,
    )
