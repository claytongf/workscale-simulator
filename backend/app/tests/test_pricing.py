import pytest

from app.modules.pricing.formulas import calculate_final_price, calculate_unit_cost
from app.modules.pricing.schemas import PricingInput
from app.modules.pricing.service import calculate_pricing


def test_unit_cost():
    assert calculate_unit_cost(1000.0, 50.0) == 20.0
    assert calculate_unit_cost(0.0, 10.0) == 0.0


def test_unit_cost_invalid():
    with pytest.raises(ValueError):
        calculate_unit_cost(-100.0, 10.0)
    with pytest.raises(ValueError):
        calculate_unit_cost(100.0, 0.0)
    with pytest.raises(ValueError):
        calculate_unit_cost(100.0, -5.0)


def test_final_price():
    # 20.0 / (1 - 0.3) = 28.57...
    assert abs(calculate_final_price(20.0, 0.30) - 28.57) < 0.01
    assert calculate_final_price(20.0, 0.0) == 20.0


def test_final_price_invalid():
    with pytest.raises(ValueError):
        calculate_final_price(-20.0, 0.30)
    with pytest.raises(ValueError):
        calculate_final_price(20.0, 1.0)
    with pytest.raises(ValueError):
        calculate_final_price(20.0, 1.5)
    with pytest.raises(ValueError):
        calculate_final_price(20.0, -0.1)


def test_pricing_service():
    inp = PricingInput(desired_margin=0.20)
    res = calculate_pricing(inp, company_monthly_cost=1000.0, company_net_output=50.0)
    # unit_cost = 1000 / 50 = 20
    # final_price = 20 / (1 - 0.2) = 25
    assert res.unit_cost == 20.0
    assert res.final_price == 25.0
