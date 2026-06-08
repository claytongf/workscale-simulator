from app.modules.schedule.schemas import ScheduleInput
from app.modules.simulation.schemas import SimulationInput, WorkerInput
from app.modules.simulation.service import simulate_period


def test_simulation_runs_correct_number_of_days():
    sim_input = SimulationInput(
        period_days=30,
        worker=WorkerInput(sleep_hours=8.0, commute_hours=1.0),
        schedule=ScheduleInput(type="5x2", hours_per_day=8.0)
    )
    result = simulate_period(sim_input)
    assert len(result.daily_results) == 30
    assert result.summary.total_hours_worked > 0.0

def test_schedule_workdays_comparison():
    # 5x2 schedule vs 6x1 schedule over 7 days
    worker = WorkerInput(sleep_hours=8.0, commute_hours=1.0)
    
    sim_5x2 = SimulationInput(
        period_days=7,
        worker=worker,
        schedule=ScheduleInput(type="5x2", hours_per_day=8.0)
    )
    res_5x2 = simulate_period(sim_5x2)
    workdays_5x2 = sum(1 for r in res_5x2.daily_results if r.is_workday)
    rest_days_5x2 = sum(1 for r in res_5x2.daily_results if r.is_rest_day)
    assert workdays_5x2 == 5
    assert rest_days_5x2 == 2
    
    sim_6x1 = SimulationInput(
        period_days=7,
        worker=worker,
        schedule=ScheduleInput(type="6x1", hours_per_day=8.0)
    )
    res_6x1 = simulate_period(sim_6x1)
    workdays_6x1 = sum(1 for r in res_6x1.daily_results if r.is_workday)
    rest_days_6x1 = sum(1 for r in res_6x1.daily_results if r.is_rest_day)
    assert workdays_6x1 == 6
    assert rest_days_6x1 == 1

def test_vacation_applied_at_end_of_year():
    # 365 days simulation with 30 vacation days
    sim_input = SimulationInput(
        period_days=365,
        worker=WorkerInput(sleep_hours=8.0, commute_hours=1.0),
        schedule=ScheduleInput(type="5x2", hours_per_day=8.0, vacation_days_per_year=30)
    )
    result = simulate_period(sim_input)
    
    vacation_days_count = sum(1 for r in result.daily_results if r.is_vacation)
    assert vacation_days_count == 30
    
    # Check that the last 30 days are marked as vacation
    for r in result.daily_results[-30:]:
        assert r.is_vacation is True
        assert r.is_workday is False
        assert r.hours_worked == 0.0

def test_summary_consistency():
    sim_input = SimulationInput(
        period_days=30,
        worker=WorkerInput(sleep_hours=8.0, commute_hours=1.0),
        schedule=ScheduleInput(type="5x2", hours_per_day=8.0)
    )
    result = simulate_period(sim_input)
    
    # total hours worked in summary matches daily sum
    sum_hours = sum(r.hours_worked for r in result.daily_results)
    assert result.summary.total_hours_worked == sum_hours
    
    # total net output matches daily sum
    sum_net = sum(r.net_output for r in result.daily_results)
    assert result.summary.net_output == sum_net
