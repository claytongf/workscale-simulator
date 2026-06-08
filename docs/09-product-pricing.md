# 09 — Precificação

## Objetivo

Calcular o impacto dos cenários de trabalho no custo por unidade e no preço final de produtos ou serviços.

## Produção total

```txt
company_gross_output =
sum(worker_gross_output)
```

```txt
company_net_output =
sum(worker_net_output)
```

## Custo por unidade

```txt
unit_cost =
company_monthly_cost / company_net_output
```

## Preço final

```txt
final_price =
unit_cost / (1 - desired_margin)
```

Exemplo:

```txt
unit_cost = 50
desired_margin = 0.30

final_price = 50 / (1 - 0.30)
final_price = 71.43
```

## Variáveis

```txt
raw_material_cost
fixed_costs
variable_costs
labor_cost
taxes_on_revenue
desired_margin
units_produced
net_output
rework_cost
loss_rate
```

## Cenários de precificação

A aplicação deve permitir comparar:

```txt
Cenário A:
6x1 sem contratação adicional

Cenário B:
5x2 sem contratação adicional

Cenário C:
5x2 com contratação para manter produção

Cenário D:
4x3 com ganho de produtividade

Cenário E:
40h semanais com salário mantido

Cenário F:
40h semanais com salário/hora mantido
```

## Métricas exibidas

```txt
custo total
produção bruta
produção líquida
custo por unidade
margem desejada
preço final
variação percentual do preço
variação percentual da produção
```

## Implementação Técnica

As regras de precificação e cálculo de margens estão implementadas no módulo de backend:
- Fórmulas de custo unitário e preço final: [formulas.py](file:///home/clayton/development/projects/techwing/workscale-simulator/backend/app/modules/pricing/formulas.py)
- Orquestração do cálculo de precificação: [service.py](file:///home/clayton/development/projects/techwing/workscale-simulator/backend/app/modules/pricing/service.py)
- Esquemas de validação de dados: [schemas.py](file:///home/clayton/development/projects/techwing/workscale-simulator/backend/app/modules/pricing/schemas.py)

