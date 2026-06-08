from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.modules.country.routes import router as country_router
from app.modules.report.routes import router as report_router
from app.modules.simulation.routes import router as simulation_router

app = FastAPI(
    title="WorkScale Simulator API",
    description=(
        "Educational simulator for comparing work schedules, "
        "worker energy, and product pricing."
    ),
    version="0.1.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health")
def health_check() -> dict[str, str]:
    return {
        "status": "ok",
        "service": "workscale-simulator-api"
    }

app.include_router(simulation_router)
app.include_router(country_router)
app.include_router(report_router)



