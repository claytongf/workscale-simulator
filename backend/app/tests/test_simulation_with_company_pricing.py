from fastapi.testclient import TestClient

from app.main import app

client = TestClient(app)


def test_simulation_without_company_pricing():
    payload = {
        "period_days": 10,
        "worker": {
            "job_type": "software_development",
            "productivity_level": 5,
            "experience_level": 5,
        },
        "schedule": {
            "type": "5x2",
            "hours_per_day": 8.0,
        },
    }
    response = client.post("/api/simulations", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert "summary" in data
    assert "daily_results" in data
    assert "company" in data
    assert "pricing" in data
    assert data["company"] is None
    assert data["pricing"] is None


def test_simulation_with_company_pricing():
    payload = {
        "period_days": 30,
        "worker": {
            "job_type": "software_development",
            "productivity_level": 5,
            "experience_level": 5,
        },
        "schedule": {
            "type": "5x2",
            "hours_per_day": 8.0,
        },
        "company": {
            "number_of_employees": 3,
            "gross_salary": 4000.0,
            "total_employer_tax_rate": 0.15,
            "benefits": 400.0,
            "fixed_costs": 5000.0,
        },
        "pricing": {
            "desired_margin": 0.25,
        },
    }
    response = client.post("/api/simulations", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["company"] is not None
    assert data["pricing"] is not None
    assert "company_monthly_cost" in data["company"]
    assert "final_price" in data["pricing"]
    assert data["pricing"]["unit_cost"] > 0
    assert data["pricing"]["final_price"] > 0


def test_simulation_with_company_only():
    payload = {
        "period_days": 30,
        "worker": {},
        "schedule": {
            "type": "5x2",
            "hours_per_day": 8.0,
        },
        "company": {
            "number_of_employees": 3,
            "gross_salary": 4000.0,
        },
    }
    response = client.post("/api/simulations", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["company"] is not None
    assert data["pricing"] is None


def test_simulation_invalid_margin():
    payload = {
        "period_days": 30,
        "worker": {},
        "schedule": {
            "type": "5x2",
            "hours_per_day": 8.0,
        },
        "company": {
            "number_of_employees": 3,
            "gross_salary": 4000.0,
        },
        "pricing": {
            "desired_margin": 1.0,  # Invalid: must be lt 1.0
        },
    }
    response = client.post("/api/simulations", json=payload)
    assert response.status_code == 422
