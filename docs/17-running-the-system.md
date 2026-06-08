# 17 — Running the System

This guide explains how to use WorkScale Simulator after it is running.

---

## 1. Open the Application

Navigate to http://localhost:3000 in your browser. You will see the home page with an overview of the project and a button to start the simulator.

## 2. Start a New Simulation

Click **"Start Simulator"** on the home page. You will be taken to the simulator form.

## 3. Choose a Work Schedule

Select one of the available work schedule types:

| Schedule | Description |
|---|---|
| 6×1 | 6 workdays, 1 rest day per week |
| 5×2 | 5 workdays, 2 rest days per week |
| 4×3 | 4 workdays, 3 rest days per week |
| 12×36 | 12 hours on, 36 hours off |
| Custom | Define your own workdays per week and hours per day |

Configure the **hours per day** for the chosen schedule.

## 4. Configure Worker Profile

Set the **productivity level** (1–10):

- 1 = very low productivity
- 5 = average productivity
- 10 = exceptional productivity

> Productivity level affects output quantity, not energy consumption or effort. It is not a judgment of human worth.

## 5. Configure Experience Level

Set the **experience level** (1–10):

- Lower experience = higher error rates
- Higher experience = lower error rates and better output

> Experience represents familiarity with the work, not intelligence.

## 6. Configure Sleep and Commute

- **Sleep hours**: How many hours the worker sleeps per night (affects energy recovery)
- **Commute hours**: Daily round-trip commute time (drains energy on workdays)

## 7. Configure Vacation

Set the **vacation days per year**. During vacation days, the worker does not work, energy recovers faster, and burnout decreases.

## 8. Optionally Add Company Assumptions

Expand the company cost section to configure:

- Number of employees
- Gross salary
- Employer tax rate
- Benefits
- Fixed costs, variable costs, material costs, operational costs
- Vacation provision and thirteenth salary provision
- Training costs, absenteeism costs, turnover costs, equipment costs

These values are used to calculate company monthly cost and cost per unit produced.

> All values are editable estimates. Country presets can pre-fill tax rates for selected countries.

## 9. Optionally Add Pricing Assumptions

Set the **desired profit margin** (0 to 1, exclusive). The system calculates:

```
unit_cost   = company_monthly_cost / company_net_output
final_price = unit_cost / (1 - desired_margin)
```

## 10. Run the Simulation

Click **"Run Simulation"**. The engine simulates each day over the configured period (30, 90, or 365 days).

## 11. Analyze the Dashboard

The dashboard displays:

- **Energy bar** — current energy level (0–100)
- **Burnout bar** — accumulated burnout (0–100)
- **Stat cards** — average energy, total output, error rate, free time
- **Energy chart** — energy over time
- **Burnout chart** — burnout accumulation over time
- **Output chart** — daily gross and net output

If company costs and pricing were configured, additional stats show:

- Company monthly cost
- Unit cost
- Final price

## 12. Compare Scenarios

Navigate to the **Compare** page to run multiple scenarios side by side. For each scenario:

1. Give it a unique name
2. Configure worker, schedule, company, and pricing parameters
3. Optionally select a baseline scenario

The comparison shows:

- Per-scenario summaries
- Absolute differences against the baseline
- Percentage differences against the baseline
- Direction indicators (higher/lower/equal)

> The system does not declare winners or losers. It shows trade-offs.

## 13. Export Reports

Use the **Export** buttons on the dashboard to download results in:

- **JSON** — structured data with all assumptions and results
- **CSV** — tabular daily results
- **Markdown** — readable report with sections

Every exported report includes:

- Project name and title
- Assumptions used
- Simulation results
- Ethical disclaimer and limitations notice

## 14. Read Limitations

The simulator footer and all exported reports include the following notice:

> This simulator is educational and experimental. It does not replace labor, legal, accounting, tax, medical, psychological, or economic advice. Results depend on user-provided assumptions. The goal is scenario comparison, not absolute truth.

## 15. Animated Simulation Mode

Once you have run a simulation (either a single scenario on the simulator page or up to 3 scenarios on the comparison page), you can switch to the **"Simulação Animada"** tab.

The backend computes the full simulation once. The frontend then animates the returned `daily_results`; it does not recalculate energy, burnout, productivity, costs, or prices in the browser.

- **Default timing**: 1 real second represents 1 simulated day.
- **Speed controls**: 0.5x, 1x, 2x, and 5x are available for longer simulations such as 365 days.
- **Synchronized playback**: Play, pause, restart, and speed changes apply to every active scenario.
- **Side-by-side comparison**: Up to 3 scenarios can animate together. If one scenario is shorter, it remains on its final day while the others continue.
- **Game-style status bars**: Energy uses each daily result's `energy_end`; burnout uses each daily result's `burnout`.
- **Daily metrics**: Gross output, net output, free time, and error rate update from the current daily result.
- **Day type badges**: Each panel displays `Workday`, `Rest day`, or `Vacation day` based on API flags.

This mode is visual and educational. It does not change backend formulas or simulation results.
