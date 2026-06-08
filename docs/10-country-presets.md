# 10 — Presets por país

## Objetivo

Permitir comparação internacional entre escalas, custos e regras de trabalho.

## Países sugeridos

```txt
Brasil
Estados Unidos
Reino Unido
União Europeia / país genérico EU
Portugal
Alemanha
França
Canadá
Japão
```

## Importante

Não existe um único modelo global de trabalho.

Mesmo dentro da União Europeia, há diretivas gerais e regras nacionais. Portanto, cada país deve ter presets próprios e editáveis.

## Estrutura do preset

```json
{
  "country": "BR",
  "name": "Brazil CLT Generic",
  "currency": "BRL",
  "default_weekly_hours": 44,
  "paid_vacation_days": 30,
  "public_holidays": 10,
  "employer_tax_rates": {
    "inss": 0.20,
    "fgts": 0.08,
    "rat_sat": 0.02,
    "third_party": 0.058
  },
  "benefits": {
    "transport": 0,
    "meal": 0,
    "health": 0
  },
  "editable": true
}
```

## Presets iniciais

```txt
Brazil_CLT_Generic
Brazil_CLT_Simples_Generic
Brazil_CLT_Lucro_Presumido_Generic
Brazil_CLT_Lucro_Real_Generic
USA_Hourly_Generic
UK_Employee_Generic
EU_Generic
Portugal_Generic
Germany_Generic
France_Generic
Canada_Generic
Japan_Generic
```

## Regras

- Todo preset deve ser editável.
- A fonte do preset deve ser registrada.
- A data da última atualização deve ser exibida.
- O app deve avisar que os valores são estimativas.

## Implementação Técnica

Os presets de países foram implementados de forma estática e controlada por versão:
- Banco de dados em JSON: [country_presets.json](file:///home/clayton/development/projects/techwing/workscale-simulator/backend/app/modules/country/data/country_presets.json)
- Esquemas de validação Pydantic: [schemas.py](file:///home/clayton/development/projects/techwing/workscale-simulator/backend/app/modules/country/schemas.py)
- Serviço de carregamento e consulta: [service.py](file:///home/clayton/development/projects/techwing/workscale-simulator/backend/app/modules/country/service.py)
- Rotas da API FastAPI: [routes.py](file:///home/clayton/development/projects/techwing/workscale-simulator/backend/app/modules/country/routes.py)

> [!NOTE]
> Os presets de países são estimativas educacionais e não substituem assessoria contábil, jurídica, tributária ou trabalhista profissional.

