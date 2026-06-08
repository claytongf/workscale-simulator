import pytest

from app.modules.energy.formulas import (
    calculate_commute_energy_cost,
    calculate_next_energy,
    calculate_sleep_recovery,
    calculate_work_energy_cost,
    clamp_energy,
)


def test_clamp_energy():
    assert clamp_energy(120.0) == 100.0
    assert clamp_energy(-20.0) == 0.0
    assert clamp_energy(50.0) == 50.0

def test_work_energy_cost():
    assert calculate_work_energy_cost(8.0, 5.0) == 40.0
    assert calculate_work_energy_cost(8.0, 5.0, overtime_multiplier=1.5) == 60.0
    
    with pytest.raises(ValueError):
        calculate_work_energy_cost(-1.0, 5.0)
    with pytest.raises(ValueError):
        calculate_work_energy_cost(8.0, -5.0)
    with pytest.raises(ValueError):
        calculate_work_energy_cost(8.0, 5.0, overtime_multiplier=-1.0)

def test_commute_energy_cost():
    assert calculate_commute_energy_cost(2.0, 3.0, 1.2) == pytest.approx(7.2)
    
    with pytest.raises(ValueError):
        calculate_commute_energy_cost(-1.0, 3.0)
    with pytest.raises(ValueError):
        calculate_commute_energy_cost(2.0, -3.0)
    with pytest.raises(ValueError):
        calculate_commute_energy_cost(2.0, 3.0, -1.0)

def test_sleep_recovery():
    # 50 energy, 8 hours sleep, recovery rate 12.0, quality 1.0
    # ratio = 1 - 50/100 = 0.5. sleep_rec = 8 * 12 * 1 * 0.5 = 48.0
    assert calculate_sleep_recovery(50.0, 8.0, 12.0, 1.0) == 48.0
    
    # increases energy (starts lower, retrieves more recovery)
    assert calculate_sleep_recovery(
        10.0, 8.0, 12.0, 1.0
    ) > calculate_sleep_recovery(80.0, 8.0, 12.0, 1.0)
    
    with pytest.raises(ValueError):
        calculate_sleep_recovery(50.0, -1.0)
    with pytest.raises(ValueError):
        calculate_sleep_recovery(50.0, 8.0, sleep_quality_factor=2.5)

def test_next_energy_clamped():
    # Large work cost should drain energy to 0 (clamped)
    assert calculate_next_energy(50.0, work_cost=200.0) == 0.0
    # Large sleep recovery should top at 100
    assert calculate_next_energy(80.0, sleep_recovery=50.0) == 100.0
