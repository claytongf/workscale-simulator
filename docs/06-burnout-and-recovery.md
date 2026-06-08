# 06 — Burnout e recuperação

## Diferença entre energia e burnout

```txt
energia = curto prazo
burnout = longo prazo
```

Energia pode recuperar em horas ou dias.

Burnout acumula ao longo de semanas ou meses.

## Variáveis

```txt
burnout_current
burnout_max
burnout_min
fatigue_accumulation
sleep_deprivation_factor
overwork_factor
recovery_factor
vacation_recovery
```

## Fórmula de burnout

```txt
burnout_next =
burnout_current
+ fatigue_accumulation
+ sleep_deprivation_factor
+ overwork_factor
- recovery_factor
- vacation_recovery
```

Com limite:

```txt
burnout_next = min(100, max(0, burnout_next))
```

## Fadiga acumulada

```txt
fatigue_accumulation =
max(0, ideal_energy_threshold - energy_end_day)
* fatigue_rate
```

Exemplo:

```txt
ideal_energy_threshold = 60
energy_end_day = 35
fatigue_rate = 0.05

fatigue_accumulation = 25 * 0.05 = 1.25
```

## Efeitos do burnout

Burnout alto pode afetar:

- produtividade;
- recuperação;
- taxa de erro;
- risco de ausência;
- qualidade de vida;
- estabilidade da produção.

## Regra inicial sugerida

```txt
burnout < 30: baixo risco
30 <= burnout < 60: risco moderado
60 <= burnout < 80: risco alto
burnout >= 80: risco crítico
```
