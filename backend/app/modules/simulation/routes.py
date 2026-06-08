from fastapi import APIRouter

from app.modules.simulation.comparison_service import compare_scenarios
from app.modules.simulation.schemas import (
    CompareSimulationsInput,
    CompareSimulationsResult,
    SimulationInput,
    SimulationResult,
)
from app.modules.simulation.service import simulate_period

router = APIRouter(prefix="/api/simulations", tags=["simulations"])


@router.post("", response_model=SimulationResult)
def run_simulation(input_data: SimulationInput) -> SimulationResult:
    return simulate_period(input_data)


@router.post("/compare", response_model=CompareSimulationsResult)
def compare_simulations(
    input_data: CompareSimulationsInput,
) -> CompareSimulationsResult:
    return compare_scenarios(input_data)

