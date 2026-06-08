# 04 — Modelo de energia

## Objetivo

Representar a energia física e mental disponível do trabalhador ao longo do tempo.

A energia é uma barra de 0 a 100.

```txt
energy_max = 100
energy_min = 0
```

## Variáveis principais

```txt
energy_current
energy_max
energy_min
energy_start_day
energy_end_day
energy_average
```

## Consumo de energia

A energia diminui por:

```txt
work_energy_cost
commute_energy_cost
domestic_task_cost
stress_cost
sleep_deprivation_cost
overtime_cost
night_shift_cost
```

## Recuperação de energia

A energia aumenta por:

```txt
sleep_recovery
rest_recovery
leisure_recovery
exercise_recovery
vacation_recovery
```

## Custo do trabalho

```txt
work_cost =
hours_worked
* job_energy_cost_per_hour
* overtime_multiplier
* night_shift_multiplier
* stress_multiplier
```

Exemplo:

```txt
job_energy_cost_per_hour = 5
hours_worked = 8
overtime_multiplier = 1.0
night_shift_multiplier = 1.0
stress_multiplier = 1.1

work_cost = 8 * 5 * 1.0 * 1.0 * 1.1
work_cost = 44
```

## Custo do deslocamento

```txt
commute_cost =
commute_hours
* commute_energy_cost_per_hour
* commute_stress_multiplier
```

Exemplo:

```txt
commute_hours = 2
commute_energy_cost_per_hour = 3
commute_stress_multiplier = 1.2

commute_cost = 7.2
```

## Recuperação por sono

Modelo simples:

```txt
sleep_recovery =
sleep_hours
* sleep_recovery_rate
* sleep_quality_factor
```

Modelo recomendado:

```txt
sleep_recovery =
sleep_hours
* sleep_recovery_rate
* sleep_quality_factor
* (1 - energy_current / energy_max)
```

Esse segundo modelo faz a recuperação ser maior quando a energia está muito baixa, mas dificulta recuperar até 100%.

## Tipos de trabalho e gasto energético inicial

```txt
office: 4 energia/hora
creative: 5 energia/hora
software_development: 5 energia/hora
customer_service: 6 energia/hora
retail: 7 energia/hora
healthcare: 8 energia/hora
manual_moderate: 9 energia/hora
manual_heavy: 11 energia/hora
transportation: 7 energia/hora
```

Esses valores devem ser editáveis.
