# 08 — Custos da empresa

## Objetivo

Calcular o custo empresarial de cada cenário de trabalho.

## Custo total por funcionário

```txt
employee_total_cost =
gross_salary
+ employer_taxes
+ benefits
+ vacation_provision
+ thirteenth_salary_provision
+ training_cost
+ absenteeism_cost
+ turnover_cost
+ equipment_cost
```

## Variáveis principais

```txt
number_of_employees
gross_salary
employer_taxes
benefits
training_cost
equipment_cost
absenteeism_cost
turnover_cost
fixed_costs
variable_costs
material_costs
operational_costs
taxes_on_revenue
rework_costs
```

## Custo empresarial mensal

```txt
company_monthly_cost =
sum(employee_total_cost)
+ fixed_costs
+ variable_costs
+ material_costs
+ operational_costs
+ taxes_on_revenue
+ rework_costs
+ absenteeism_costs
+ turnover_costs
```

## Encargos Brasil

Para o Brasil, os presets devem ser tratados com cuidado, porque variam conforme regime tributário, setor e enquadramento.

Variáveis:

```txt
inss_employer_rate
fgts_rate
rat_sat_rate
third_party_rate
thirteenth_salary_provision
vacation_provision
vacation_bonus_provision
transport_voucher
meal_voucher
health_insurance
```

Presets sugeridos:

```txt
Brazil_CLT_Generic
Brazil_CLT_Simples_Generic
Brazil_CLT_Lucro_Presumido_Generic
Brazil_CLT_Lucro_Real_Generic
```

Aviso obrigatório na interface:

```txt
Os encargos trabalhistas são estimativas configuráveis. Consulte legislação vigente, contador ou especialista trabalhista para decisões reais.
```

## Encargos Estados Unidos

Variáveis:

```txt
social_security_employer_rate
medicare_employer_rate
futa_rate
suta_rate
workers_compensation
health_benefits
paid_time_off
```

## Encargos Reino Unido

Variáveis:

```txt
employer_national_insurance_rate
pension_contribution
paid_leave_cost
benefits
```

## Impacto de mudança de escala

A empresa poderá comparar:

```txt
Cenário A: redução de jornada sem contratação
Cenário B: redução de jornada com contratação adicional
Cenário C: redução de jornada com ganho de produtividade
Cenário D: manutenção da escala atual
Cenário E: aumento de automação
```

## Implementação Técnica

Os cálculos e regras de custos da empresa estão implementados no módulo de backend:
- Fórmulas matemáticas básicas e validações: [formulas.py](file:///home/clayton/development/projects/techwing/workscale-simulator/backend/app/modules/company/formulas.py)
- Orquestração do cálculo de custos da simulação: [service.py](file:///home/clayton/development/projects/techwing/workscale-simulator/backend/app/modules/company/service.py)
- Esquemas de validação de dados: [schemas.py](file:///home/clayton/development/projects/techwing/workscale-simulator/backend/app/modules/company/schemas.py)

