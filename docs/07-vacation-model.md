# 07 — Modelo de férias

## Objetivo

Representar o impacto das férias na recuperação de energia e redução parcial de burnout.

## Variáveis

```txt
vacation_days_per_year
vacation_frequency
vacation_quality
vacation_paid
vacation_energy_recovery_rate
vacation_burnout_recovery_rate
post_vacation_decay_rate
```

## Durante férias

Durante férias:

```txt
work_cost = 0
commute_cost = 0 ou reduzido
sleep_recovery aumenta
stress_cost reduz
burnout reduz parcialmente
```

## Recuperação de energia nas férias

```txt
vacation_recovery =
vacation_days
* vacation_quality
* vacation_recovery_rate
```

## Redução de burnout nas férias

```txt
burnout_next =
burnout_current
- vacation_days * vacation_burnout_recovery_rate * vacation_quality
```

Com limite:

```txt
burnout_next = max(0, burnout_next)
```

## Observação

Férias não devem recuperar tudo instantaneamente.

Um trabalhador com burnout alto pode melhorar nas férias, mas não necessariamente voltar a 100%.

## Possíveis configurações

```txt
sem férias
7 dias por ano
15 dias por ano
20 dias por ano
30 dias por ano
férias fracionadas
férias concentradas
férias pagas
férias não pagas
```
