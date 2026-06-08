from pydantic import BaseModel, Field


class PricingInput(BaseModel):
    desired_margin: float = Field(default=0.30, ge=0.0, lt=1.0)


class PricingResult(BaseModel):
    unit_cost: float
    final_price: float
