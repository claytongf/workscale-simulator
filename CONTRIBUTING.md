# Contributing to WorkScale Simulator

Thank you for your interest in contributing to WorkScale Simulator! We welcome contributions from developers, designers, writers, and anyone interested in educational simulators.

---

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [How to Report Bugs](#how-to-report-bugs)
- [How to Request Features](#how-to-request-features)
- [How to Propose Formula Changes](#how-to-propose-formula-changes)
- [How to Add or Update Country Presets](#how-to-add-or-update-country-presets)
- [Development Setup](#development-setup)
- [Running Backend Checks](#running-backend-checks)
- [Running Frontend Checks](#running-frontend-checks)
- [Coding Standards](#coding-standards)
- [Documentation Standards](#documentation-standards)
- [Ethical Guidelines](#ethical-guidelines)
- [Pull Request Process](#pull-request-process)

---

## Code of Conduct

Be respectful and constructive. This project serves an educational purpose. We do not tolerate language that blames, humiliates, or devalues workers based on their productivity, experience, or work conditions.

---

## How to Report Bugs

Use the [Bug Report template](.github/ISSUE_TEMPLATE/bug_report.md) and include:

- A clear description of the problem
- Steps to reproduce
- Expected vs. actual behavior
- Screenshots or logs, if applicable
- Your environment (OS, browser, Python/Node versions)

---

## How to Request Features

Use the [Feature Request template](.github/ISSUE_TEMPLATE/feature_request.md) and include:

- The problem your feature solves
- Your proposed solution
- Alternatives you considered
- Impact on users

---

## How to Propose Formula Changes

Formula changes affect the mathematical core of the simulator and must be handled carefully.

Use the [Formula Change template](.github/ISSUE_TEMPLATE/formula_change.md) and include:

- Which formula is affected
- Current behavior
- Proposed behavior
- Reasoning and references
- Expected impact on simulation results
- Which tests should be updated

**Important:** Formula changes must not be placed in API route handlers or frontend components. The simulation engine must remain isolated.

---

## How to Add or Update Country Presets

Country presets are editable estimates stored in `backend/app/modules/country/data/country_presets.json`.

Use the [Country Preset Update template](.github/ISSUE_TEMPLATE/country_preset_update.md) and include:

- Country preset being updated
- Field to update
- Current and proposed values
- Source (official government data, tax authority, or labor organization)
- Last updated date
- Notes explaining any nuance
- Confirmation that the preset remains an editable estimate

**Important:** Country presets are educational estimates and must not be presented as legal, tax, or accounting advice.

---

## Development Setup

### Backend

```bash
cd backend
python -m venv .venv
source .venv/bin/activate
pip install -e ".[dev]"
uvicorn app.main:app --reload
```

### Frontend

```bash
cd frontend
npm install
cp .env.example .env.local
npm run dev
```

### Docker

```bash
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env.local
docker compose up --build
```

---

## Running Backend Checks

Before submitting a PR, run all backend validations:

```bash
cd backend
pytest
ruff check .
mypy .
```

All three commands must pass without errors.

---

## Running Frontend Checks

Before submitting a PR, run all frontend validations:

```bash
cd frontend
npm run lint
npm run type-check
npm run build
```

All three commands must pass without errors.

---

## Coding Standards

### Backend (Python)

- Use Python 3.12+
- Follow Ruff rules: `E`, `F`, `I`, `N`, `UP`, `B`, `C4`, `SIM`
- Use strict Mypy type checking
- Use Pydantic for data validation
- Keep the simulation engine isolated from routes
- No formulas in route handlers

### Frontend (TypeScript)

- Use TypeScript strict mode
- Use Zod for form validation
- Use React Hook Form for form handling
- Use TanStack Query for server state
- No simulation formulas in frontend code

---

## Documentation Standards

- Update documentation when behavior changes
- Keep formulas documented and tested
- Use neutral, non-judgmental language
- All exported reports must include ethical disclaimers
- Country presets must include sources and update dates
- Mathematical model changes require updating `docs/03-mathematical-model.md`

---

## Ethical Guidelines

This project follows strict ethical principles:

1. **Do not hardcode conclusions.** The simulator compares scenarios; it does not declare winners.
2. **Use neutral language.** Avoid terms like "lazy", "weak", or "useless". Use "low productivity", "average productivity", "high productivity".
3. **Productivity is not human worth.** A worker with low productivity is not less valuable as a person.
4. **Energy is not willpower.** Low energy can result from poor sleep, long commutes, or lack of rest.
5. **Experience is not intelligence.** Experience affects output and error rates, not cognitive ability.
6. **Country presets are estimates.** They are not legal, tax, or accounting advice.
7. **Results depend on assumptions.** Always present results as estimates, not absolute truths.

---

## Pull Request Process

1. **Fork** the repository and create a branch following the naming convention:
   - `feature/description` — new features
   - `fix/description` — bug fixes
   - `docs/description` — documentation changes
   - `refactor/description` — code refactoring

2. **Implement** your changes with appropriate tests.

3. **Run all checks** before opening the PR:
   ```bash
   # Backend
   cd backend && pytest && ruff check . && mypy .

   # Frontend
   cd frontend && npm run lint && npm run type-check && npm run build
   ```

4. **Open a Pull Request** using the [PR template](.github/pull_request_template.md).

5. **Address review feedback** promptly.

### PR Checklist

- [ ] Tests added or updated
- [ ] Backend checks pass (`pytest`, `ruff check .`, `mypy .`)
- [ ] Frontend checks pass (`lint`, `type-check`, `build`), if applicable
- [ ] Documentation updated
- [ ] No formulas added to frontend
- [ ] No formulas added to route handlers
- [ ] Neutral language preserved
- [ ] Ethics and limitations preserved
