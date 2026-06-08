from fastapi.testclient import TestClient

from app.main import app

client = TestClient(app)


def test_api_list_presets():
    response = client.get("/api/countries/presets")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    assert len(data) >= 9
    first = data[0]
    assert "key" in first
    assert "country_code" in first
    assert "country_name" in first
    assert "preset_name" in first
    assert "currency" in first


def test_api_get_preset_valid():
    response = client.get("/api/countries/presets/Brazil_CLT_Generic")
    assert response.status_code == 200
    data = response.json()
    assert data["key"] == "Brazil_CLT_Generic"
    assert data["country_code"] == "BR"
    assert data["default_weekly_hours"] == 44.0
    assert "employer_tax_rates" in data
    assert "benefit_defaults" in data


def test_api_get_preset_invalid():
    response = client.get("/api/countries/presets/Invalid_Preset_Key")
    assert response.status_code == 404
    data = response.json()
    assert data["detail"] == "Country preset not found"
