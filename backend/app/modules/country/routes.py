
from fastapi import APIRouter, HTTPException, status

from app.modules.country.schemas import CountryPreset, CountryPresetSummary
from app.modules.country.service import get_country_preset, list_country_presets

router = APIRouter(prefix="/api/countries", tags=["countries"])


@router.get("/presets", response_model=list[CountryPresetSummary])
def get_presets() -> list[CountryPresetSummary]:
    return list_country_presets()


@router.get("/presets/{preset_key}", response_model=CountryPreset)
def get_preset_detail(preset_key: str) -> CountryPreset:
    preset = get_country_preset(preset_key)
    if not preset:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Country preset not found",
        )
    return preset
