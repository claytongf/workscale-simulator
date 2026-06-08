# 05 — Modelo de produtividade

## Objetivo

Calcular a produção gerada pelo trabalhador a partir de:

- horas trabalhadas;
- energia disponível;
- produtividade pessoal;
- experiência;
- ferramentas;
- ambiente;
- estresse;
- taxa de erro.

## Variáveis

```txt
base_output_per_hour
worker_productivity_level
experience_level
energy_factor
tooling_factor
environment_factor
stress_factor
error_rate
rework_rate
```

## Perfil produtivo do trabalhador

O perfil produtivo afeta **quantidade produzida**, não esforço, energia ou cansaço.

Escala sugerida:

```txt
1  = produtividade muito baixa
2  = baixa produtividade
3  = produtividade irregular
4  = produtividade abaixo da média
5  = produtividade média
6  = boa produtividade
7  = alta produtividade
8  = produtividade muito alta
9  = produtividade excelente
10 = produtividade excepcional
```

Multiplicadores iniciais:

```txt
1: 0.40
2: 0.50
3: 0.65
4: 0.80
5: 1.00
6: 1.10
7: 1.25
8: 1.40
9: 1.60
10: 1.85
```

## Nível de experiência

A experiência afeta:

- velocidade;
- qualidade;
- autonomia;
- taxa de erro;
- necessidade de supervisão;
- retrabalho.

Escala:

```txt
1  = iniciante
2  = júnior inicial
3  = júnior
4  = júnior avançado
5  = pleno inicial
6  = pleno
7  = pleno avançado
8  = sênior
9  = especialista
10 = referência técnica
```

Multiplicadores iniciais:

```txt
1: 0.50
2: 0.60
3: 0.70
4: 0.85
5: 1.00
6: 1.10
7: 1.20
8: 1.35
9: 1.50
10: 1.70
```

## Fator energia

Modelo simples:

```txt
energy_factor = energy_current / 100
```

Modelo recomendado:

```txt
energy_factor =
1 / (1 + e^(-k * (energy_current - midpoint)))
```

Parâmetros iniciais:

```txt
k = 0.08
midpoint = 50
```

Esse modelo evita uma queda perfeitamente linear e representa melhor a queda forte de desempenho quando a energia fica muito baixa.

## Produção bruta

```txt
gross_output =
hours_worked
* base_output_per_hour
* worker_productivity_factor
* experience_factor
* energy_factor
* tooling_factor
* environment_factor
```

## Taxa de erro

```txt
error_rate =
base_error_rate
* low_energy_error_factor
* low_experience_error_factor
* stress_error_factor
```

## Produção líquida

```txt
net_output =
gross_output
* (1 - error_rate)
```

## Retrabalho

```txt
rework_cost =
gross_output
* error_rate
* rework_cost_per_error
```
