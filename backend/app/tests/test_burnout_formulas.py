from app.modules.energy.formulas import (
    calculate_fatigue_accumulation,
    calculate_next_burnout,
    clamp_burnout,
)


def test_clamp_burnout():
    assert clamp_burnout(150.0) == 100.0
    assert clamp_burnout(-10.0) == 0.0
    assert clamp_burnout(45.0) == 45.0

def test_fatigue_accumulation():
    # energy_end_day above ideal threshold (60) should accumulate 0 fatigue
    assert calculate_fatigue_accumulation(70.0, ideal_energy_threshold=60.0) == 0.0
    
    # energy_end_day below ideal threshold
    # (40 vs 60 threshold, rate 0.05) -> 20 * 0.05 = 1.0
    assert calculate_fatigue_accumulation(
        40.0, ideal_energy_threshold=60.0, fatigue_rate=0.05
    ) == 1.0

def test_burnout_accumulation_and_vacation_reduction():
    # fatigue accumulation increases burnout
    b_start = 20.0
    b_next = calculate_next_burnout(b_start, fatigue_accumulation=2.0)
    assert b_next == 22.0
    
    # vacation reduces burnout
    b_vac = calculate_next_burnout(b_start, vacation_recovery=5.0)
    assert b_vac == 15.0
    
    # recovery factor reduces burnout
    b_rec = calculate_next_burnout(b_start, recovery_factor=1.0)
    assert b_rec == 19.0
