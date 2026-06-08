from fastapi.testclient import TestClient

from app.main import app

client = TestClient(app)


def test_compare_simulations_valid():
    payload = {
        "scenarios": [
            {
                "name": "Scenario A",
                "simulation": {
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
                },
            },
            {
                "name": "Scenario B",
                "simulation": {
                    "period_days": 30,
                    "worker": {
                        "job_type": "software_development",
                        "productivity_level": 5,
                        "experience_level": 5,
                    },
                    "schedule": {
                        "type": "6x1",
                        "hours_per_day": 8.0,
                    },
                },
            },
        ]
    }
    response = client.post("/api/simulations/compare", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert "baseline_scenario_name" in data
    assert data["baseline_scenario_name"] == "Scenario A"
    assert "scenarios" in data
    assert len(data["scenarios"]) == 2
    assert data["scenarios"][0]["name"] == "Scenario A"
    assert data["scenarios"][1]["name"] == "Scenario B"
    assert "summary" in data["scenarios"][0]
    assert "deltas" in data
    assert len(data["deltas"]) == 2

    # Check metrics
    deltas_b = next(d for d in data["deltas"] if d["scenario_name"] == "Scenario B")
    assert deltas_b["compared_to"] == "Scenario A"
    assert len(deltas_b["deltas"]) == 5
    metric_names = [d["metric"] for d in deltas_b["deltas"]]
    assert "average_energy" in metric_names
    assert "burnout" in metric_names


def test_compare_simulations_custom_baseline():
    payload = {
        "baseline_scenario_name": "Scenario B",
        "scenarios": [
            {
                "name": "Scenario A",
                "simulation": {
                    "period_days": 30,
                    "worker": {},
                    "schedule": {
                        "type": "5x2",
                        "hours_per_day": 8.0,
                    },
                },
            },
            {
                "name": "Scenario B",
                "simulation": {
                    "period_days": 30,
                    "worker": {},
                    "schedule": {
                        "type": "6x1",
                        "hours_per_day": 8.0,
                    },
                },
            },
        ],
    }
    response = client.post("/api/simulations/compare", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["baseline_scenario_name"] == "Scenario B"


def test_compare_simulations_fewer_than_two():
    payload = {
        "scenarios": [
            {
                "name": "Scenario A",
                "simulation": {
                    "period_days": 30,
                    "worker": {},
                    "schedule": {
                        "type": "5x2",
                        "hours_per_day": 8.0,
                    },
                },
            }
        ]
    }
    response = client.post("/api/simulations/compare", json=payload)
    assert response.status_code == 422


def test_compare_simulations_empty_scenario_name():
    payload = {
        "scenarios": [
            {
                "name": "",
                "simulation": {
                    "period_days": 30,
                    "worker": {},
                    "schedule": {
                        "type": "5x2",
                        "hours_per_day": 8.0,
                    },
                },
            },
            {
                "name": "Scenario B",
                "simulation": {
                    "period_days": 30,
                    "worker": {},
                    "schedule": {
                        "type": "6x1",
                        "hours_per_day": 8.0,
                    },
                },
            },
        ]
    }
    response = client.post("/api/simulations/compare", json=payload)
    assert response.status_code == 422


def test_compare_simulations_duplicate_names():
    payload = {
        "scenarios": [
            {
                "name": "Scenario A",
                "simulation": {
                    "period_days": 30,
                    "worker": {},
                    "schedule": {
                        "type": "5x2",
                        "hours_per_day": 8.0,
                    },
                },
            },
            {
                "name": "Scenario A",
                "simulation": {
                    "period_days": 30,
                    "worker": {},
                    "schedule": {
                        "type": "6x1",
                        "hours_per_day": 8.0,
                    },
                },
            },
        ]
    }
    response = client.post("/api/simulations/compare", json=payload)
    assert response.status_code == 422
