import math

WORKER_PRODUCTIVITY_MULTIPLIERS = {
    1: 0.40,
    2: 0.50,
    3: 0.65,
    4: 0.80,
    5: 1.00,
    6: 1.10,
    7: 1.25,
    8: 1.40,
    9: 1.60,
    10: 1.85,
}

EXPERIENCE_MULTIPLIERS = {
    1: 0.50,
    2: 0.60,
    3: 0.70,
    4: 0.85,
    5: 1.00,
    6: 1.10,
    7: 1.20,
    8: 1.35,
    9: 1.50,
    10: 1.70,
}

def get_worker_productivity_factor(level: int) -> float:
    if level not in WORKER_PRODUCTIVITY_MULTIPLIERS:
        raise ValueError("level must be between 1 and 10")
    return WORKER_PRODUCTIVITY_MULTIPLIERS[level]

def get_experience_factor(level: int) -> float:
    if level not in EXPERIENCE_MULTIPLIERS:
        raise ValueError("level must be between 1 and 10")
    return EXPERIENCE_MULTIPLIERS[level]

def calculate_energy_productivity_factor(
    energy_current: float,
    k: float = 0.08,
    midpoint: float = 50.0,
) -> float:
    # Sigmoid function: 1 / (1 + e^(-k * (energy_current - midpoint)))
    # Clip exponent to avoid math overflow
    exp_val = -k * (energy_current - midpoint)
    exp_val = max(-50.0, min(50.0, exp_val))
    val = 1.0 / (1.0 + math.exp(exp_val))
    return min(1.0, max(0.0, val))

def calculate_gross_output(
    hours_worked: float,
    base_output_per_hour: float,
    worker_productivity_factor: float,
    experience_factor: float,
    energy_factor: float,
    tooling_factor: float = 1.0,
    environment_factor: float = 1.0,
) -> float:
    if hours_worked < 0.0:
        raise ValueError("hours_worked cannot be negative")
    if base_output_per_hour < 0.0:
        raise ValueError("base_output_per_hour cannot be negative")
    if (
        worker_productivity_factor < 0.0
        or experience_factor < 0.0
        or energy_factor < 0.0
    ):
        raise ValueError("factors cannot be negative")
        
    output = (
        hours_worked
        * base_output_per_hour
        * worker_productivity_factor
        * experience_factor
        * energy_factor
        * tooling_factor
        * environment_factor
    )
    return max(0.0, output)

def calculate_error_rate(
    base_error_rate: float,
    energy_current: float,
    experience_level: int,
    stress_error_factor: float = 1.0,
) -> float:
    if not (0.0 <= base_error_rate <= 1.0):
        raise ValueError("base_error_rate must be between 0 and 1")
    if not (1 <= experience_level <= 10):
        raise ValueError("experience_level must be between 1 and 10")
    if stress_error_factor < 0.0:
        raise ValueError("stress_error_factor cannot be negative")
        
    # lower energy increases error
    # E.g. at 100 energy, low_energy_error_factor = 1.0. At 0 energy, factor = 2.0.
    low_energy_error_factor = 1.0 + max(0.0, (50.0 - energy_current) / 50.0)
    
    # lower experience increases error
    # E.g. experience level 1 -> 2.0, Pleno level 5 -> 1.0, Senior level 10 -> 0.5
    low_experience_error_factor = 2.0 - (experience_level * 0.15)
    
    error_rate = (
        base_error_rate
        * low_energy_error_factor
        * low_experience_error_factor
        * stress_error_factor
    )
    return min(1.0, max(0.0, error_rate))

def calculate_net_output(
    gross_output: float,
    error_rate: float,
) -> float:
    if gross_output < 0.0:
        raise ValueError("gross_output cannot be negative")
    if not (0.0 <= error_rate <= 1.0):
        raise ValueError("error_rate must be between 0 and 1")
        
    return max(0.0, gross_output * (1.0 - error_rate))
