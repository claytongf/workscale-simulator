# 18 — Project Presentation

---

## Elevator Pitch

**WorkScale Simulator** is an open source educational simulator that compares work schedules using a videogame-inspired energy bar, productivity modeling, company cost simulation, and product pricing impact.

It turns an ideological debate into an interactive simulation with transparent, editable assumptions.

---

## Problem

Discussions about work schedules — 6×1 vs 5×2 vs 4×3 — often become ideological and simplistic:

- "Fewer hours always improve life quality"
- "Companies would collapse without long shifts"
- "Workers should just work harder"
- "All overtime is exploitation"

These claims ignore trade-offs. Real-world scheduling decisions involve energy, productivity, company costs, pricing, and labor regulations — all of which vary by country, industry, and individual circumstances.

There is no widely available tool that lets users **explore these trade-offs interactively** with transparent assumptions.

---

## Solution

WorkScale Simulator allows users to:

1. Create and configure work schedule scenarios (6×1, 5×2, 4×3, 12×36, custom)
2. Simulate worker energy, burnout, and productivity over time
3. Calculate company costs (salaries, taxes, benefits, overhead)
4. Determine unit cost and final product price
5. Compare multiple scenarios with absolute and percentage deltas
6. Apply country-specific labor cost presets
7. Export results with full assumptions and ethical disclaimers

The simulator **does not claim** which schedule is universally better. It shows **what happens under the user's assumptions**.

---

## Technical Highlights

| Area | Implementation |
|---|---|
| Simulation engine | Pure Python, isolated from API and UI |
| Backend API | FastAPI with Pydantic validation |
| Frontend | Next.js with TypeScript, TailwindCSS, Recharts |
| Mathematical modeling | Energy, burnout, productivity, company cost, pricing |
| Data validation | Pydantic (backend) + Zod (frontend) |
| Scenario comparison | Multi-scenario with baseline deltas |
| Country presets | Versioned JSON data, validated at load time |
| Report export | JSON, CSV, Markdown with ethical disclaimers |
| Animated Simulation Mode | Frontend animation over backend-provided daily results, with up to 3 scenarios side by side |
| Testing | 67+ tests covering formulas, API, and edge cases |
| CI/CD | GitHub Actions for backend and frontend |
| Containerization | Docker Compose for one-command setup |

---

## Portfolio Value

This project demonstrates:

- **Backend architecture** — modular FastAPI application with isolated domain modules
- **API design** — RESTful endpoints with comprehensive Pydantic schemas
- **Frontend development** — Next.js dashboard with interactive charts and forms
- **Data visualization** — Recharts-based energy, burnout, and output charts
- **Mathematical modeling** — bounded energy/burnout systems with productivity formulas
- **Testing discipline** — comprehensive unit and integration tests
- **Documentation quality** — structured docs covering architecture, models, API, and ethics
- **Open source organization** — contribution guidelines, issue templates, PR templates, CI/CD
- **Product thinking** — solving a real-world information gap with a usable tool
- **Ethical engineering** — built-in disclaimers, neutral language, and transparent assumptions

---

## Demo Flow

1. **Show home page** — overview and call to action
2. **Open simulator** — navigate to the simulation form
3. **Configure a 6×1 scenario** — set schedule, worker profile, sleep, commute
4. **Run simulation** — execute and see results on the dashboard
5. **Switch to Animated Simulation Mode** — watch the worker's energy bar and burnout bar change day by day from the returned `daily_results`
6. **Show energy chart** — visualize energy draining over workdays and recovering on rest days
7. **Show burnout chart** — observe long-term fatigue accumulation
8. **Add company cost assumptions** — set salary, taxes, benefits, fixed costs
9. **Show unit cost and final price** — see how schedule affects pricing
10. **Compare scenarios (6x1, 5x2, 4x3)** — run side-by-side comparison with deltas for up to 3 scenarios
11. **Switch to Comparative Animated Mode** — compare 6x1, 5x2, and 4x3 side by side with synchronized day-by-day animated bars
12. **Export report** — download Markdown report with assumptions and disclaimers
13. **Show GitHub repository** — present code quality, documentation, CI, and structure

---

## Ethical Note

This project is built with the following commitments:

- **No hardcoded conclusions.** The simulator compares scenarios; it does not pick winners.
- **No moral judgments on workers.** Productivity, energy, and experience are simulation variables, not measures of human value.
- **No legal, tax, or medical advice.** All results are educational estimates.
- **Transparent assumptions.** Every input is editable and every formula is documented.
- **Every exported report includes an ethical disclaimer.** Users cannot share results without the accompanying limitations notice.
