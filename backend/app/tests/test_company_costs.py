import pytest

from app.modules.company.formulas import (
    calculate_company_monthly_cost,
    calculate_employee_total_cost,
    calculate_employer_taxes,
    calculate_rework_costs,
)
from app.modules.company.schemas import CompanyInput
from app.modules.company.service import calculate_company_costs


def test_employer_taxes():
    assert calculate_employer_taxes(3000.0, 0.20) == 600.0
    assert calculate_employer_taxes(0.0, 0.20) == 0.0


def test_employer_taxes_negative():
    with pytest.raises(ValueError):
        calculate_employer_taxes(-1000.0, 0.20)
    with pytest.raises(ValueError):
        calculate_employer_taxes(1000.0, -0.10)


def test_employee_total_cost():
    total = calculate_employee_total_cost(
        gross_salary=3000.0,
        employer_taxes=600.0,
        benefits=300.0,
        vacation_provision=250.0,
        thirteenth_salary_provision=250.0,
        training_cost=100.0,
        absenteeism_cost=50.0,
        turnover_cost=50.0,
        equipment_cost=100.0,
    )
    assert total == 4700.0


def test_employee_total_cost_negative():
    with pytest.raises(ValueError):
        calculate_employee_total_cost(gross_salary=-10.0)
    with pytest.raises(ValueError):
        calculate_employee_total_cost(gross_salary=10.0, benefits=-5.0)


def test_company_monthly_cost():
    total = calculate_company_monthly_cost(
        employee_total_cost=4700.0,
        number_of_employees=5,
        fixed_costs=10000.0,
        variable_costs=2000.0,
        material_costs=3000.0,
        operational_costs=1500.0,
        taxes_on_revenue=500.0,
        rework_costs=300.0,
    )
    # (4700.0 * 5) + 10000 + 2000 + 3000 + 1500 + 500 + 300 = 23500 + 17300 = 40800
    assert total == 40800.0


def test_company_monthly_cost_invalid_employees():
    with pytest.raises(ValueError):
        calculate_company_monthly_cost(
            employee_total_cost=1000.0, number_of_employees=0
        )
    with pytest.raises(ValueError):
        calculate_company_monthly_cost(
            employee_total_cost=1000.0, number_of_employees=-5
        )


def test_rework_costs():
    cost = calculate_rework_costs(
        gross_output=100.0, error_rate=0.05, rework_cost_per_error=10.0
    )
    # 100 * 0.05 * 10 = 50.0
    assert cost == 50.0


def test_rework_costs_invalid():
    with pytest.raises(ValueError):
        calculate_rework_costs(
            gross_output=-10.0, error_rate=0.05, rework_cost_per_error=10.0
        )
    with pytest.raises(ValueError):
        calculate_rework_costs(
            gross_output=100.0, error_rate=-0.1, rework_cost_per_error=10.0
        )
    with pytest.raises(ValueError):
        calculate_rework_costs(
            gross_output=100.0, error_rate=1.5, rework_cost_per_error=10.0
        )
    with pytest.raises(ValueError):
        calculate_rework_costs(
            gross_output=100.0, error_rate=0.05, rework_cost_per_error=-1.0
        )


def test_calculate_company_costs_service():
    inp = CompanyInput(
        number_of_employees=2,
        gross_salary=5000.0,
        total_employer_tax_rate=0.20,
        benefits=500.0,
        vacation_provision_rate=0.0833,
        vacation_bonus_provision=100.0,
        thirteenth_salary_rate=0.0833,
        training_cost=200.0,
        absenteeism_cost=50.0,
        turnover_cost=100.0,
        equipment_cost=150.0,
        fixed_costs=8000.0,
        variable_costs=1000.0,
        material_costs=500.0,
        operational_costs=400.0,
        taxes_on_revenue=200.0,
        rework_cost_per_error=25.0,
    )
    res = calculate_company_costs(company_input=inp, gross_output=10.0, error_rate=0.10)
    # employer_taxes = 5000 * 0.2 = 1000
    # vacation_provision = 5000 * 0.0833 + 100 = 516.5
    # thirteenth = 5000 * 0.0833 = 416.5
    # employee_total_cost = (
    #     5000 + 1000 + 500 + 516.5 + 416.5 + 200 + 50 + 100 + 150
    # ) = 7933.0
    # rework = 10 * 0.1 * 25 = 25.0
    # company_monthly_cost = (
    #     (7933 * 2) + 8000 + 1000 + 500 + 400 + 200 + 25
    # ) = 15866 + 10125 = 25991
    assert res.employer_taxes == 1000.0
    assert abs(res.vacation_provision - 516.5) < 1.0
    assert abs(res.thirteenth_salary_provision - 416.5) < 1.0
    assert abs(res.employee_total_cost - 7933.0) < 1.0
    assert res.rework_costs == 25.0
    assert abs(res.company_monthly_cost - 25991.0) < 1.0
