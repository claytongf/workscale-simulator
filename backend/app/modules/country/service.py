import json
import os

from app.modules.country.schemas import CountryPreset, CountryPresetSummary

CURRENT_DIR = os.path.dirname(os.path.abspath(__file__))
JSON_PATH = os.path.join(CURRENT_DIR, "data", "country_presets.json")

# In-memory cache for validated presets
_cached_presets: dict[str, CountryPreset] = {}


def load_country_presets() -> dict[str, CountryPreset]:
    global _cached_presets
    if _cached_presets:
        return _cached_presets

    if not os.path.exists(JSON_PATH):
        raise FileNotFoundError(f"Country presets database not found at {JSON_PATH}")

    with open(JSON_PATH, encoding="utf-8") as f:
        data = json.load(f)

    presets = {}
    for item in data:
        validated = CountryPreset.model_validate(item)
        presets[validated.key] = validated

    _cached_presets = presets
    return _cached_presets


def list_country_presets() -> list[CountryPresetSummary]:
    presets = load_country_presets()
    return [
        CountryPresetSummary(
            key=p.key,
            country_code=p.country_code,
            country_name=p.country_name,
            preset_name=p.preset_name,
            currency=p.currency,
        )
        for p in presets.values()
    ]


def get_country_preset(preset_key: str) -> CountryPreset | None:
    presets = load_country_presets()
    return presets.get(preset_key)
