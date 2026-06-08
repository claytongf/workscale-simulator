from fastapi.testclient import TestClient

from app.main import app

client = TestClient(app)


def test_api_export_json_valid():
    payload = {
        "title": "API JSON Test",
        "simulation": {
            "period_days": 5,
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
    }
    response = client.post("/api/reports/export/json", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["filename"].endswith(".json")
    assert data["content_type"] == "application/json"
    assert "data" in data
    assert data["data"]["report_title"] == "API JSON Test"


def test_api_export_csv_valid():
    payload = {
        "title": "API CSV Test",
        "simulation": {
            "period_days": 5,
            "worker": {},
            "schedule": {
                "type": "5x2",
                "hours_per_day": 8.0,
            },
        },
    }
    response = client.post("/api/reports/export/csv", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["filename"].endswith(".csv")
    assert data["content_type"] == "text/csv"
    assert "content" in data


def test_api_export_markdown_valid():
    payload = {
        "title": "API MD Test",
        "simulation": {
            "period_days": 5,
            "worker": {},
            "schedule": {
                "type": "5x2",
                "hours_per_day": 8.0,
            },
        },
    }
    response = client.post("/api/reports/export/markdown", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["filename"].endswith(".md")
    assert data["content_type"] == "text/markdown"
    assert "content" in data


def test_api_export_invalid():
    # Invalid request (neither simulation nor comparison provided)
    payload = {
        "title": "Invalid Test",
    }
    response = client.post("/api/reports/export/json", json=payload)
    assert response.status_code == 422
