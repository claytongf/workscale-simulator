def clamp_energy(value: float) -> float:
    return min(100.0, max(0.0, value))

def calculate_work_energy_cost(
    hours_worked: float,
    job_energy_cost_per_hour: float,
    overtime_multiplier: float = 1.0,
    night_shift_multiplier: float = 1.0,
    stress_multiplier: float = 1.0,
) -> float:
    if hours_worked < 0.0:
        raise ValueError("hours_worked cannot be negative")
    if job_energy_cost_per_hour < 0.0:
        raise ValueError("job_energy_cost_per_hour cannot be negative")
    if (
        overtime_multiplier < 0.0
        or night_shift_multiplier < 0.0
        or stress_multiplier < 0.0
    ):
        raise ValueError("multipliers must be greater than or equal to 0")
        
    return (
        hours_worked
        * job_energy_cost_per_hour
        * overtime_multiplier
        * night_shift_multiplier
        * stress_multiplier
    )

def calculate_commute_energy_cost(
    commute_hours: float,
    commute_energy_cost_per_hour: float = 3.0,
    commute_stress_multiplier: float = 1.0,
) -> float:
    if commute_hours < 0.0:
        raise ValueError("commute_hours cannot be negative")
    if commute_energy_cost_per_hour < 0.0:
        raise ValueError("commute_energy_cost_per_hour cannot be negative")
    if commute_stress_multiplier < 0.0:
        raise ValueError("commute_stress_multiplier must be greater than or equal to 0")
        
    return (
        commute_hours
        * commute_energy_cost_per_hour
        * commute_stress_multiplier
    )

def calculate_sleep_recovery(
    energy_current: float,
    sleep_hours: float,
    sleep_recovery_rate: float = 12.0,
    sleep_quality_factor: float = 1.0,
    energy_max: float = 100.0,
) -> float:
    if sleep_hours < 0.0:
        raise ValueError("sleep_hours cannot be negative")
    if not (0.0 <= sleep_quality_factor <= 2.0):
        raise ValueError("sleep_quality_factor must be between 0 and 2")
        
    energy_clamped = clamp_energy(energy_current)
    ratio = 1.0 - (energy_clamped / energy_max)
    return sleep_hours * sleep_recovery_rate * sleep_quality_factor * ratio

def calculate_rest_recovery(
    rest_hours: float,
    rest_recovery_rate: float = 2.0,
    rest_quality_factor: float = 1.0,
) -> float:
    if rest_hours < 0.0:
        raise ValueError("rest_hours cannot be negative")
    if rest_recovery_rate < 0.0:
        raise ValueError("rest_recovery_rate cannot be negative")
    if rest_quality_factor < 0.0:
        raise ValueError("rest_quality_factor cannot be negative")
    return rest_hours * rest_recovery_rate * rest_quality_factor

def calculate_vacation_recovery(
    vacation_quality: float = 1.0,
    vacation_energy_recovery_rate: float = 8.0,
) -> float:
    if vacation_quality < 0.0:
        raise ValueError("vacation_quality cannot be negative")
    if vacation_energy_recovery_rate < 0.0:
        raise ValueError("vacation_energy_recovery_rate cannot be negative")
    return vacation_quality * vacation_energy_recovery_rate

def calculate_next_energy(
    energy_current: float,
    work_cost: float = 0.0,
    commute_cost: float = 0.0,
    domestic_cost: float = 0.0,
    stress_cost: float = 0.0,
    sleep_recovery: float = 0.0,
    rest_recovery: float = 0.0,
    leisure_recovery: float = 0.0,
    vacation_recovery: float = 0.0,
) -> float:
    energy_clamped = clamp_energy(energy_current)
    energy_next = (
        energy_clamped
        - work_cost
        - commute_cost
        - domestic_cost
        - stress_cost
        + sleep_recovery
        + rest_recovery
        + leisure_recovery
        + vacation_recovery
    )
    return clamp_energy(energy_next)

# --- Burnout formulas ---

def clamp_burnout(value: float) -> float:
    return min(100.0, max(0.0, value))

def calculate_fatigue_accumulation(
    energy_end_day: float,
    ideal_energy_threshold: float = 60.0,
    fatigue_rate: float = 0.05,
) -> float:
    if fatigue_rate < 0.0:
        raise ValueError("fatigue_rate cannot be negative")
    return max(0.0, ideal_energy_threshold - energy_end_day) * fatigue_rate

def calculate_next_burnout(
    burnout_current: float,
    fatigue_accumulation: float = 0.0,
    sleep_deprivation_factor: float = 0.0,
    overwork_factor: float = 0.0,
    recovery_factor: float = 0.0,
    vacation_recovery: float = 0.0,
) -> float:
    burnout_clamped = clamp_burnout(burnout_current)
    burnout_next = (
        burnout_clamped
        + fatigue_accumulation
        + sleep_deprivation_factor
        + overwork_factor
        - recovery_factor
        - vacation_recovery
    )
    return clamp_burnout(burnout_next)
