from fastapi.testclient import TestClient

from app.main import app

client = TestClient(app)


def test_post_simulation_valid():
    payload = {
        "period_days": 30,
        "worker": {
            "job_type": "software_development",
            "job_energy_cost_per_hour": 5.0,
            "monthly_salary": 6000.0,
            "productivity_level": 7,
            "experience_level": 8,
            "sleep_hours": 7.0,
            "sleep_quality_factor": 1.0,
            "commute_hours": 1.5,
            "base_output_per_hour": 1.0,
            "base_error_rate": 0.05,
        },
        "schedule": {
            "type": "5x2",
            "hours_per_day": 8.0,
            "vacation_days_per_year": 0,
        },
    }
    response = client.post("/api/simulations", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert "summary" in data
    assert "daily_results" in data
    assert len(data["daily_results"]) == 30
    assert "average_energy" in data["summary"]
    assert "burnout" in data["summary"]


def test_post_simulation_invalid_productivity():
    payload = {
        "period_days": 30,
        "worker": {
            "productivity_level": 11,  # Invalid: max 10
        },
        "schedule": {
            "type": "5x2",
            "hours_per_day": 8.0,
        },
    }
    response = client.post("/api/simulations", json=payload)
    assert response.status_code == 422


def test_post_simulation_invalid_experience():
    payload = {
        "period_days": 30,
        "worker": {
            "experience_level": 0,  # Invalid: min 1
        },
        "schedule": {
            "type": "5x2",
            "hours_per_day": 8.0,
        },
    }
    response = client.post("/api/simulations", json=payload)
    assert response.status_code == 422


def test_post_simulation_negative_hours():
    payload = {
        "period_days": 30,
        "worker": {},
        "schedule": {
            "type": "5x2",
            "hours_per_day": -1.0,  # Invalid: min 0
        },
    }
    response = client.post("/api/simulations", json=payload)
    assert response.status_code == 422


def test_post_simulation_invalid_schedule_type():
    payload = {
        "period_days": 30,
        "worker": {},
        "schedule": {
            "type": "invalid_type",  # Invalid schedule type literal
            "hours_per_day": 8.0,
        },
    }
    response = client.post("/api/simulations", json=payload)
    assert response.status_code == 422
