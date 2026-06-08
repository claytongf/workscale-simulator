from app.modules.schedule.schemas import ScheduleInput
from app.modules.simulation.comparison_service import (
    compare_scenarios,
    compute_metric_delta,
)
from app.modules.simulation.schemas import (
    CompareSimulationsInput,
    ScenarioInput,
    SimulationInput,
    WorkerInput,
)


def test_compute_metric_delta_basic():
    # Scenario is higher
    delta = compute_metric_delta("average_energy", 50.0, 75.0)
    assert delta.metric == "average_energy"
    assert delta.baseline_value == 50.0
    assert delta.scenario_value == 75.0
    assert delta.absolute_difference == 25.0
    assert delta.percentage_difference == 50.0
    assert delta.direction == "higher"

    # Scenario is lower
    delta = compute_metric_delta("average_energy", 80.0, 60.0)
    assert delta.absolute_difference == -20.0
    assert delta.percentage_difference == -25.0
    assert delta.direction == "lower"

    # Scenario is same
    delta = compute_metric_delta("average_energy", 50.0, 50.0)
    assert delta.absolute_difference == 0.0
    assert delta.percentage_difference == 0.0
    assert delta.direction == "same"


def test_compute_metric_delta_zero_safety():
    # Both zero
    delta = compute_metric_delta("average_energy", 0.0, 0.0)
    assert delta.absolute_difference == 0.0
    assert delta.percentage_difference == 0.0
    assert delta.direction == "same"

    # Baseline zero, scenario positive
    delta = compute_metric_delta("average_energy", 0.0, 10.0)
    assert delta.absolute_difference == 10.0
    assert delta.percentage_difference is None
    assert delta.direction == "higher"

    # Baseline zero, scenario negative
    delta = compute_metric_delta("average_energy", 0.0, -10.0)
    assert delta.absolute_difference == -10.0
    assert delta.percentage_difference is None
    assert delta.direction == "lower"


def test_compute_metric_delta_none():
    # Missing metrics
    delta = compute_metric_delta("average_energy", None, 10.0)
    assert delta.absolute_difference is None
    assert delta.percentage_difference is None
    assert delta.direction == "not_comparable"

    delta = compute_metric_delta("average_energy", 10.0, None)
    assert delta.absolute_difference is None
    assert delta.percentage_difference is None
    assert delta.direction == "not_comparable"


def test_compare_scenarios_logic():
    sim_input = SimulationInput(
        period_days=30,
        worker=WorkerInput(job_type="office", job_energy_cost_per_hour=5.0),
        schedule=ScheduleInput(type="5x2", hours_per_day=8.0),
    )
    input_data = CompareSimulationsInput(
        scenarios=[
            ScenarioInput(name="Scenario A", simulation=sim_input),
            ScenarioInput(name="Scenario B", simulation=sim_input),
        ]
    )

    result = compare_scenarios(input_data)
    assert result.baseline_scenario_name == "Scenario A"
    assert len(result.scenarios) == 2
    assert len(result.deltas) == 2

    # Deltas check for baseline scenario itself
    baseline_delta = next(d for d in result.deltas if d.scenario_name == "Scenario A")
    assert baseline_delta.compared_to == "Scenario A"
    for delta in baseline_delta.deltas:
        assert delta.absolute_difference == 0.0
        assert delta.percentage_difference == 0.0
        assert delta.direction == "same"
