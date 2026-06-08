from app.modules.pricing.formulas import calculate_final_price, calculate_unit_cost
from app.modules.pricing.schemas import PricingInput, PricingResult


def calculate_pricing(
    pricing_input: PricingInput,
    company_monthly_cost: float,
    company_net_output: float,
) -> PricingResult:
    unit_cost = calculate_unit_cost(
        company_monthly_cost=company_monthly_cost,
        company_net_output=company_net_output,
    )
    
    final_price = calculate_final_price(
        unit_cost=unit_cost,
        desired_margin=pricing_input.desired_margin,
    )
    
    return PricingResult(
        unit_cost=unit_cost,
        final_price=final_price,
    )
