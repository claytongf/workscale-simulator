def calculate_employer_taxes(
    gross_salary: float,
    total_employer_tax_rate: float,
) -> float:
    if gross_salary < 0:
        raise ValueError("gross_salary cannot be negative")
    if total_employer_tax_rate < 0:
        raise ValueError("total_employer_tax_rate cannot be negative")
    return gross_salary * total_employer_tax_rate


def calculate_employee_total_cost(
    gross_salary: float,
    employer_taxes: float = 0.0,
    benefits: float = 0.0,
    vacation_provision: float = 0.0,
    thirteenth_salary_provision: float = 0.0,
    training_cost: float = 0.0,
    absenteeism_cost: float = 0.0,
    turnover_cost: float = 0.0,
    equipment_cost: float = 0.0,
) -> float:
    costs = [
        gross_salary,
        employer_taxes,
        benefits,
        vacation_provision,
        thirteenth_salary_provision,
        training_cost,
        absenteeism_cost,
        turnover_cost,
        equipment_cost,
    ]
    for c in costs:
        if c < 0:
            raise ValueError("All cost components must be greater than or equal to 0")
    
    total = sum(costs)
    return total


def calculate_company_monthly_cost(
    employee_total_cost: float,
    number_of_employees: int,
    fixed_costs: float = 0.0,
    variable_costs: float = 0.0,
    material_costs: float = 0.0,
    operational_costs: float = 0.0,
    taxes_on_revenue: float = 0.0,
    rework_costs: float = 0.0,
) -> float:
    if number_of_employees < 1:
        raise ValueError("number_of_employees must be greater than or equal to 1")
    
    costs = [
        employee_total_cost,
        fixed_costs,
        variable_costs,
        material_costs,
        operational_costs,
        taxes_on_revenue,
        rework_costs,
    ]
    for c in costs:
        if c < 0:
            raise ValueError("All cost components must be greater than or equal to 0")
            
    return (employee_total_cost * number_of_employees) + sum(costs[1:])


def calculate_rework_costs(
    gross_output: float,
    error_rate: float,
    rework_cost_per_error: float,
) -> float:
    if gross_output < 0:
        raise ValueError("gross_output cannot be negative")
    if not (0.0 <= error_rate <= 1.0):
        raise ValueError("error_rate must be between 0.0 and 1.0")
    if rework_cost_per_error < 0:
        raise ValueError("rework_cost_per_error cannot be negative")
        
    return gross_output * error_rate * rework_cost_per_error
