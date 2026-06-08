from app.modules.country.service import list_country_presets, load_country_presets


def test_required_presets_exist():
    presets = load_country_presets()
    required_keys = [
        "Brazil_CLT_Generic",
        "USA_Hourly_Generic",
        "UK_Employee_Generic",
        "EU_Generic",
        "Portugal_Generic",
        "Germany_Generic",
        "France_Generic",
        "Canada_Generic",
        "Japan_Generic",
    ]
    for key in required_keys:
        assert key in presets


def test_unique_preset_keys():
    # Since load_country_presets returns a dict keyed by 'key', if we inspect the length
    # of list summaries vs keys, we can guarantee uniqueness.
    summaries = list_country_presets()
    keys = [s.key for s in summaries]
    assert len(keys) == len(set(keys))


def test_preset_metadata():
    presets = load_country_presets()
    for preset in presets.values():
        assert preset.source_label is not None
        assert len(preset.source_label) > 0
        assert preset.source_url is not None
        assert len(preset.source_url) > 0
        assert preset.last_updated is not None
        assert len(preset.last_updated) > 0
        assert preset.notes is not None
        assert len(preset.notes) > 0
        assert preset.is_estimate is True
        assert preset.editable is True


def test_preset_values_validations():
    presets = load_country_presets()
    for preset in presets.values():
        assert preset.default_weekly_hours > 0.0
        assert preset.paid_vacation_days_per_year >= 0
        assert preset.public_holidays_per_year >= 0
        
        # Check rates
        rates = preset.employer_tax_rates
        assert rates.inss >= 0.0
        assert rates.fgts >= 0.0
        assert rates.rat_sat >= 0.0
        assert rates.third_party >= 0.0
        assert rates.social_security >= 0.0
        assert rates.medicare >= 0.0
        assert rates.futa >= 0.0
        assert rates.suta >= 0.0
        assert rates.national_insurance >= 0.0
        assert rates.other >= 0.0
        
        # Check benefits
        benefits = preset.benefit_defaults
        assert benefits.transport >= 0.0
        assert benefits.meal >= 0.0
        assert benefits.health >= 0.0
        assert benefits.other >= 0.0
