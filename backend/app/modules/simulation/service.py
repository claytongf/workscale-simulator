from app.modules.company.service import calculate_company_costs
from app.modules.energy.formulas import (
    calculate_commute_energy_cost,
    calculate_fatigue_accumulation,
    calculate_next_burnout,
    calculate_next_energy,
    calculate_rest_recovery,
    calculate_sleep_recovery,
    calculate_vacation_recovery,
    calculate_work_energy_cost,
)
from app.modules.pricing.service import calculate_pricing
from app.modules.productivity.formulas import (
    calculate_energy_productivity_factor,
    calculate_error_rate,
    calculate_gross_output,
    calculate_net_output,
    get_experience_factor,
    get_worker_productivity_factor,
)
from app.modules.schedule.service import check_day_is_workday
from app.modules.simulation.schemas import (
    DailySimulationResult,
    SimulationInput,
    SimulationResult,
    SimulationSummary,
)


def simulate_period(input_data: SimulationInput) -> SimulationResult:
    daily_results: list[DailySimulationResult] = []
    
    # Starting conditions
    energy_current = 100.0
    burnout_current = 0.0
    
    # Vacation days configuration: we take vacation at the end of the simulation
    # if duration is >= 365. E.g. if duration is 365 and vacation_days_per_year is 30,
    # days 336 to 365 are vacation.
    vacation_days = input_data.schedule.vacation_days_per_year
    vacation_start_day = 999999
    if input_data.period_days >= 365 and vacation_days > 0:
        vacation_start_day = input_data.period_days - vacation_days + 1
        
    total_hours_worked = 0.0
    total_free_time = 0.0
    total_gross_output = 0.0
    total_net_output = 0.0
    total_errors = 0.0
    
    for d in range(1, input_data.period_days + 1):
        is_vacation = d >= vacation_start_day
        is_workday = check_day_is_workday(d, input_data.schedule) and not is_vacation
        is_rest_day = not is_workday and not is_vacation
        
        hours_worked = input_data.schedule.hours_per_day if is_workday else 0.0
        commute_hours = input_data.worker.commute_hours if is_workday else 0.0
        sleep_hours = input_data.worker.sleep_hours
        
        # Free time
        free_time = max(0.0, 24.0 - hours_worked - commute_hours - sleep_hours)
        
        energy_start = energy_current
        
        # Energy calculations
        work_cost = 0.0
        commute_cost = 0.0
        sleep_rec = calculate_sleep_recovery(
            energy_current=energy_start,
            sleep_hours=sleep_hours,
            sleep_recovery_rate=12.0,
            sleep_quality_factor=input_data.worker.sleep_quality_factor
        )
        rest_rec = 0.0
        vacation_rec = 0.0
        
        if is_workday:
            work_cost = calculate_work_energy_cost(
                hours_worked=hours_worked,
                job_energy_cost_per_hour=input_data.worker.job_energy_cost_per_hour
            )
            commute_cost = calculate_commute_energy_cost(
                commute_hours=commute_hours
            )
        elif is_rest_day:
            rest_rec = calculate_rest_recovery(rest_hours=free_time)
        elif is_vacation:
            vacation_rec = calculate_vacation_recovery()
            
        energy_end = calculate_next_energy(
            energy_current=energy_start,
            work_cost=work_cost,
            commute_cost=commute_cost,
            domestic_cost=5.0,  # default domestic cost
            sleep_recovery=sleep_rec,
            rest_recovery=rest_rec,
            vacation_recovery=vacation_rec
        )
        
        # Burnout calculations
        fatigue_accumulation = calculate_fatigue_accumulation(energy_end_day=energy_end)
        
        # Sleep deprivation factor: 0.2 units per hour below 7.0
        sleep_deprivation_factor = max(0.0, 7.0 - sleep_hours) * 0.2
        
        # Overwork factor: 0.15 units per hour above 8.0
        overwork_factor = max(0.0, hours_worked - 8.0) * 0.15
        
        recovery_factor = 0.5 if is_rest_day else 0.0
        vacation_burnout_rec = 1.5 if is_vacation else 0.0
        
        burnout_current = calculate_next_burnout(
            burnout_current=burnout_current,
            fatigue_accumulation=fatigue_accumulation,
            sleep_deprivation_factor=sleep_deprivation_factor,
            overwork_factor=overwork_factor,
            recovery_factor=recovery_factor,
            vacation_recovery=vacation_burnout_rec
        )
        
        # Productivity outputs
        gross_output = 0.0
        error_rate = 0.0
        net_output = 0.0
        
        if is_workday:
            prod_factor = get_worker_productivity_factor(
                input_data.worker.productivity_level
            )
            exp_factor = get_experience_factor(input_data.worker.experience_level)
            energy_factor = calculate_energy_productivity_factor(energy_start)
            
            gross_output = calculate_gross_output(
                hours_worked=hours_worked,
                base_output_per_hour=input_data.worker.base_output_per_hour,
                worker_productivity_factor=prod_factor,
                experience_factor=exp_factor,
                energy_factor=energy_factor
            )
            
            error_rate = calculate_error_rate(
                base_error_rate=input_data.worker.base_error_rate,
                energy_current=energy_start,
                experience_level=input_data.worker.experience_level
            )
            
            net_output = calculate_net_output(gross_output, error_rate)
            
        # Accumulators
        total_hours_worked += hours_worked
        total_free_time += free_time
        total_gross_output += gross_output
        total_net_output += net_output
        total_errors += (gross_output * error_rate)
        
        daily_results.append(
            DailySimulationResult(
                day=d,
                is_workday=is_workday,
                is_rest_day=is_rest_day,
                is_vacation=is_vacation,
                hours_worked=hours_worked,
                hours_slept=sleep_hours,
                commute_hours=commute_hours,
                energy_start=energy_start,
                energy_end=energy_end,
                burnout=burnout_current,
                gross_output=gross_output,
                net_output=net_output,
                error_rate=error_rate,
                free_time=free_time
            )
        )
        
        # Next day starts with today's end energy
        energy_current = energy_end
        
    avg_energy = sum(r.energy_end for r in daily_results) / input_data.period_days
    avg_error_rate = (
        (total_errors / total_gross_output) if total_gross_output > 0 else 0.0
    )
    
    summary = SimulationSummary(
        average_energy=avg_energy,
        final_energy=energy_current,
        burnout=burnout_current,
        gross_output=total_gross_output,
        net_output=total_net_output,
        average_error_rate=avg_error_rate,
        total_hours_worked=total_hours_worked,
        total_free_time=total_free_time
    )
    
    company_result = None
    pricing_result = None
    
    if input_data.company is not None:
        company_result = calculate_company_costs(
            company_input=input_data.company,
            gross_output=total_gross_output,
            error_rate=avg_error_rate,
        )
        
        if input_data.pricing is not None:
            pricing_result = calculate_pricing(
                pricing_input=input_data.pricing,
                company_monthly_cost=company_result.company_monthly_cost,
                company_net_output=total_net_output,
            )
            
    return SimulationResult(
        summary=summary,
        daily_results=daily_results,
        company=company_result,
        pricing=pricing_result,
    )
