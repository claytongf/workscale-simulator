def calculate_unit_cost(
    company_monthly_cost: float,
    company_net_output: float,
) -> float:
    if company_monthly_cost < 0:
        raise ValueError("company_monthly_cost cannot be negative")
    if company_net_output <= 0:
        raise ValueError("company_net_output must be greater than zero")
    return company_monthly_cost / company_net_output


def calculate_final_price(
    unit_cost: float,
    desired_margin: float,
) -> float:
    if unit_cost < 0:
        raise ValueError("unit_cost cannot be negative")
    if not (0.0 <= desired_margin < 1.0):
        raise ValueError(
            "desired_margin must be between 0.0 (inclusive) and 1.0 (exclusive)"
        )
        
    return unit_cost / (1.0 - desired_margin)
