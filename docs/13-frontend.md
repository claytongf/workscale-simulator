# 13 — Frontend

## Objetivo

Criar uma interface visual, simples e gamificada para configurar cenários e acompanhar a simulação ao longo do tempo.

## Telas principais

### Home

Apresenta:

- conceito do projeto;
- objetivo educacional;
- botão para iniciar simulação;
- link para GitHub;
- aviso de limitações.

### Criar simulação

Formulário com:

- país;
- escala;
- salário;
- horas por dia;
- tipo de trabalho;
- deslocamento;
- sono;
- descanso;
- produtividade;
- experiência;
- férias;
- custos empresariais;
- margem.

### Dashboard

Exibe:

- barra de energia;
- barra de burnout;
- produtividade;
- produção bruta;
- produção líquida;
- custo empresarial;
- custo por unidade;
- preço final.

### Comparar cenários

Permite comparar:

- 6x1 vs 5x2;
- Brasil vs EUA;
- com férias vs sem férias;
- com contratação vs sem contratação;
- trabalhador nível 5 vs nível 8.

## Componentes visuais

```txt
EnergyBar
BurnoutBar
ProductivityBar
MoneyBar
FreeTimeBar
ScenarioForm
ComparisonChart
SimulationTimeline
StatCard
CountryPresetSelector
SchedulePresetSelector
```

## Gráficos

```txt
Energia ao longo do tempo
Burnout ao longo do tempo
Produtividade diária
Produção diária
Produção semanal
Horas livres por semana
Custo empresarial mensal
Custo por unidade
Preço final
Comparação entre escalas
Comparação entre países
Impacto das férias
```

## Estilo visual

O visual deve misturar:

- dashboard moderno;
- linguagem de games;
- barras de status;
- gráficos claros;
- visual limpo;
- tom educacional.

Inspirações:

- Street Fighter;
- FIFA stamina;
- RPG status screen;
- dashboards financeiros.

## Implementação Técnica

O frontend foi desenvolvido com **Next.js**, **React**, **TypeScript**, **TailwindCSS**, **Zod**, **React Hook Form** e **Recharts**:

### Modo de Simulação Animada
Este modo permite aos usuários assistirem visualmente à progressão temporal da simulação, dia após dia. O backend calcula a simulação completa primeiro e retorna `daily_results`; o frontend apenas anima esses resultados já calculados, sem duplicar fórmulas de energia, burnout, produtividade ou custos.

- **Velocidades de Execução**: 0.5x (2s/dia), 1x (1s/dia), 2x (0.5s/dia) e 5x (0.2s/dia).
- **Comparação Simultânea**: Permite animar de 1 a 3 cenários de forma síncrona por dia de simulação. Se os comprimentos diferirem, o cenário atinge seu dia final e permanece estático enquanto os outros continuam avançando.
- **Fonte de Dados**: As barras de energia e burnout usam `daily_results[currentDayIndex].energy_end` e `daily_results[currentDayIndex].burnout`; produção bruta, produção líquida, tempo livre e taxa de erro também vêm do mesmo item diário.
- **Tipos de Dia**: Cada painel identifica o dia como `Workday`, `Rest day` ou `Vacation day`, usando apenas flags retornadas pela API.

### Telas
- Home Page: [page.tsx](file:///home/clayton/development/projects/techwing/workscale-simulator/frontend/src/app/page.tsx)
- Simulator Dashboard: [page.tsx](file:///home/clayton/development/projects/techwing/workscale-simulator/frontend/src/app/simulator/page.tsx)
- Comparação de Cenários: [page.tsx](file:///home/clayton/development/projects/techwing/workscale-simulator/frontend/src/app/compare/page.tsx)

### Componentes
- Barras de Jogos: [EnergyBar.tsx](file:///home/clayton/development/projects/techwing/workscale-simulator/frontend/src/components/game-ui/EnergyBar.tsx), [BurnoutBar.tsx](file:///home/clayton/development/projects/techwing/workscale-simulator/frontend/src/components/game-ui/BurnoutBar.tsx), [ProductivityBar.tsx](file:///home/clayton/development/projects/techwing/workscale-simulator/frontend/src/components/game-ui/ProductivityBar.tsx)
- Elementos de Animação: [AnimatedEnergySimulation.tsx](file:///home/clayton/development/projects/techwing/workscale-simulator/frontend/src/components/game-ui/AnimatedEnergySimulation.tsx), [ScenarioEnergyPanel.tsx](file:///home/clayton/development/projects/techwing/workscale-simulator/frontend/src/components/game-ui/ScenarioEnergyPanel.tsx), [SimulationPlaybackControls.tsx](file:///home/clayton/development/projects/techwing/workscale-simulator/frontend/src/components/game-ui/SimulationPlaybackControls.tsx), [DayTypeBadge.tsx](file:///home/clayton/development/projects/techwing/workscale-simulator/frontend/src/components/game-ui/DayTypeBadge.tsx)
- Formulários: [ScenarioForm.tsx](file:///home/clayton/development/projects/techwing/workscale-simulator/frontend/src/components/forms/ScenarioForm.tsx), [ComparisonScenarioForm.tsx](file:///home/clayton/development/projects/techwing/workscale-simulator/frontend/src/components/forms/ComparisonScenarioForm.tsx), [CountryPresetSelector.tsx](file:///home/clayton/development/projects/techwing/workscale-simulator/frontend/src/components/forms/CountryPresetSelector.tsx)
- Gráficos: [EnergyChart.tsx](file:///home/clayton/development/projects/techwing/workscale-simulator/frontend/src/components/charts/EnergyChart.tsx), [BurnoutChart.tsx](file:///home/clayton/development/projects/techwing/workscale-simulator/frontend/src/components/charts/BurnoutChart.tsx), [OutputChart.tsx](file:///home/clayton/development/projects/techwing/workscale-simulator/frontend/src/components/charts/OutputChart.tsx), [ComparisonChart.tsx](file:///home/clayton/development/projects/techwing/workscale-simulator/frontend/src/components/charts/ComparisonChart.tsx)
- Layout: [AppHeader.tsx](file:///home/clayton/development/projects/techwing/workscale-simulator/frontend/src/components/layout/AppHeader.tsx), [AppShell.tsx](file:///home/clayton/development/projects/techwing/workscale-simulator/frontend/src/components/layout/AppShell.tsx)
- Dashboard: [StatCard.tsx](file:///home/clayton/development/projects/techwing/workscale-simulator/frontend/src/components/dashboard/StatCard.tsx), [SimulationSummary.tsx](file:///home/clayton/development/projects/techwing/workscale-simulator/frontend/src/components/dashboard/SimulationSummary.tsx), [ScenarioComparisonTable.tsx](file:///home/clayton/development/projects/techwing/workscale-simulator/frontend/src/components/dashboard/ScenarioComparisonTable.tsx), [ExportReportButtons.tsx](file:///home/clayton/development/projects/techwing/workscale-simulator/frontend/src/components/dashboard/ExportReportButtons.tsx)

### Serviços e Tipos
- Cliente de API: [api.ts](file:///home/clayton/development/projects/techwing/workscale-simulator/frontend/src/services/api.ts), [simulation-service.ts](file:///home/clayton/development/projects/techwing/workscale-simulator/frontend/src/services/simulation-service.ts), [report-service.ts](file:///home/clayton/development/projects/techwing/workscale-simulator/frontend/src/services/report-service.ts)
- Definições de Tipos: [simulation.ts](file:///home/clayton/development/projects/techwing/workscale-simulator/frontend/src/types/simulation.ts), [report.ts](file:///home/clayton/development/projects/techwing/workscale-simulator/frontend/src/types/report.ts)
- Zod Schemas: [scenario.schema.ts](file:///home/clayton/development/projects/techwing/workscale-simulator/frontend/src/schemas/scenario.schema.ts)
