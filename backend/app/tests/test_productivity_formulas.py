import pytest

from app.modules.productivity.formulas import (
    calculate_energy_productivity_factor,
    calculate_error_rate,
    calculate_gross_output,
    calculate_net_output,
    get_experience_factor,
    get_worker_productivity_factor,
)


def test_worker_productivity_level_scaling():
    assert get_worker_productivity_factor(10) > get_worker_productivity_factor(5)
    assert get_worker_productivity_factor(5) > get_worker_productivity_factor(1)
    
    with pytest.raises(ValueError):
        get_worker_productivity_factor(0)
    with pytest.raises(ValueError):
        get_worker_productivity_factor(11)

def test_experience_level_scaling():
    assert get_experience_factor(10) > get_experience_factor(5)
    assert get_experience_factor(5) > get_experience_factor(1)
    
    with pytest.raises(ValueError):
        get_experience_factor(0)
    with pytest.raises(ValueError):
        get_experience_factor(11)

def test_energy_productivity_sigmoid():
    factor_low = calculate_energy_productivity_factor(10.0)
    factor_high = calculate_energy_productivity_factor(90.0)
    assert 0.0 <= factor_low <= 1.0
    assert 0.0 <= factor_high <= 1.0
    assert factor_high > factor_low

def test_gross_and_net_output_non_negative():
    gross = calculate_gross_output(8.0, 10.0, 1.0, 1.0, 0.5)
    assert gross == 40.0
    
    with pytest.raises(ValueError):
        calculate_gross_output(-1.0, 10.0, 1.0, 1.0, 0.5)
        
    net = calculate_net_output(100.0, 0.05)
    assert net == 95.0
    assert calculate_net_output(10.0, 1.0) == 0.0
    
    with pytest.raises(ValueError):
        calculate_net_output(-10.0, 0.05)
    with pytest.raises(ValueError):
        calculate_net_output(100.0, 1.5)

def test_error_rate_experience_and_energy():
    # experience reduces error rate
    error_juni = calculate_error_rate(0.05, 80.0, 2)
    error_seni = calculate_error_rate(0.05, 80.0, 8)
    assert error_seni < error_juni
    
    # low energy increases error rate
    error_low_en = calculate_error_rate(0.05, 20.0, 5)
    error_high_en = calculate_error_rate(0.05, 90.0, 5)
    assert error_low_en > error_high_en
