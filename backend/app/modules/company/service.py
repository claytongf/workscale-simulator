from app.modules.company.formulas import (
    calculate_company_monthly_cost,
    calculate_employee_total_cost,
    calculate_employer_taxes,
    calculate_rework_costs,
)
from app.modules.company.schemas import CompanyCostResult, CompanyInput


def calculate_company_costs(
    company_input: CompanyInput,
    gross_output: float,
    error_rate: float,
) -> CompanyCostResult:
    # 1. Employer taxes
    employer_taxes = calculate_employer_taxes(
        gross_salary=company_input.gross_salary,
        total_employer_tax_rate=company_input.total_employer_tax_rate,
    )
    
    # 2. Provisions
    vacation_provision = (
        company_input.gross_salary * company_input.vacation_provision_rate
    ) + company_input.vacation_bonus_provision
    
    thirteenth_salary_provision = (
        company_input.gross_salary * company_input.thirteenth_salary_rate
    )
    
    # 3. Employee total cost
    employee_total_cost = calculate_employee_total_cost(
        gross_salary=company_input.gross_salary,
        employer_taxes=employer_taxes,
        benefits=company_input.benefits,
        vacation_provision=vacation_provision,
        thirteenth_salary_provision=thirteenth_salary_provision,
        training_cost=company_input.training_cost,
        absenteeism_cost=company_input.absenteeism_cost,
        turnover_cost=company_input.turnover_cost,
        equipment_cost=company_input.equipment_cost,
    )
    
    # 4. Rework costs
    rework_costs = calculate_rework_costs(
        gross_output=gross_output,
        error_rate=error_rate,
        rework_cost_per_error=company_input.rework_cost_per_error,
    )
    
    # 5. Company monthly cost
    company_monthly_cost = calculate_company_monthly_cost(
        employee_total_cost=employee_total_cost,
        number_of_employees=company_input.number_of_employees,
        fixed_costs=company_input.fixed_costs,
        variable_costs=company_input.variable_costs,
        material_costs=company_input.material_costs,
        operational_costs=company_input.operational_costs,
        taxes_on_revenue=company_input.taxes_on_revenue,
        rework_costs=rework_costs,
    )
    
    return CompanyCostResult(
        employer_taxes=employer_taxes,
        vacation_provision=vacation_provision,
        thirteenth_salary_provision=thirteenth_salary_provision,
        employee_total_cost=employee_total_cost,
        rework_costs=rework_costs,
        company_monthly_cost=company_monthly_cost,
    )
