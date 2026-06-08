# 19 — Development Workflow

This document describes the development workflow for WorkScale Simulator.

---

## Branch Naming

Use descriptive branch names with a category prefix:

| Prefix | Use Case | Example |
|---|---|---|
| `feature/` | New features | `feature/simulation-engine` |
| `fix/` | Bug fixes | `fix/pricing-validation` |
| `docs/` | Documentation changes | `docs/readme-polish` |
| `refactor/` | Code refactoring | `refactor/energy-module` |
| `test/` | Test additions or fixes | `test/burnout-edge-cases` |
| `ci/` | CI/CD changes | `ci/add-mypy-check` |

---

## Commit Style

Use a prefix that indicates the scope of the change:

```
phase-02: implement simulation engine
phase-05: add dashboard charts
feature: add country preset selector
fix: prevent division by zero in pricing
docs: update API documentation
test: add burnout boundary tests
refactor: extract energy formulas to module
ci: add frontend build check
```

Keep commit messages concise and descriptive. Use imperative mood ("add", "fix", "update", not "added", "fixed", "updated").

---

## Backend Validation Commands

Before opening a PR, run all backend checks:

```bash
cd backend

# Run tests
pytest

# Run linter
ruff check .

# Run type checker
mypy .
```

All three commands must pass without errors.

---

## Frontend Validation Commands

Before opening a PR, run all frontend checks:

```bash
cd frontend

# Run linter
npm run lint

# Run type checker
npm run type-check

# Run production build
npm run build
```

All three commands must pass without errors.

---

## PR Checklist

Before submitting a pull request, verify:

- [ ] Tests added or updated
- [ ] Backend checks pass (`pytest`, `ruff check .`, `mypy .`)
- [ ] Frontend checks pass (`npm run lint`, `npm run type-check`, `npm run build`), if applicable
- [ ] Documentation updated
- [ ] No formulas added to frontend components
- [ ] No formulas added to route handlers
- [ ] Neutral language preserved
- [ ] Ethics and limitations preserved

---

## Coding Standards

### Backend (Python)

- **Python version**: 3.12+
- **Linting**: Ruff with rules `E`, `F`, `I`, `N`, `UP`, `B`, `C4`, `SIM`
- **Type checking**: Mypy in strict mode with `ignore_missing_imports = true`
- **Data validation**: Pydantic v2 models for all API schemas
- **Testing**: Pytest with tests in `backend/app/tests/`
- **Architecture**: Simulation engine isolated from API routes. No formulas in route handlers.
- **Line length**: 88 characters

### Frontend (TypeScript)

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript in strict mode
- **Styling**: TailwindCSS
- **Forms**: React Hook Form + Zod validation
- **Data fetching**: TanStack Query
- **Charts**: Recharts
- **Linting**: ESLint with Next.js config
- **Architecture**: No simulation formulas in frontend code. All calculations come from the backend API.

---

## Documentation Standards

- Update documentation when behavior changes
- Keep formulas documented in `docs/03-mathematical-model.md` and related formula docs
- Every formula must have corresponding tests
- Use neutral, non-judgmental language in all user-facing text
- Country presets must include source and last updated date
- Exported reports must include ethical disclaimers
- API changes must be reflected in `docs/12-api.md`
- Frontend changes must be reflected in `docs/13-frontend.md`

---

## Project Structure Conventions

### Backend modules

Each backend module follows this structure:

```
backend/app/modules/<module>/
├── __init__.py
├── schemas.py       # Pydantic models
├── service.py       # Business logic
├── routes.py        # FastAPI route handlers (if applicable)
├── formulas.py      # Mathematical formulas (if applicable)
└── data/            # Static data files (if applicable)
```

### Frontend components

Components are organized by function:

```
frontend/src/components/
├── charts/          # Data visualization (Recharts)
├── dashboard/       # Summary cards and export
├── forms/           # Configuration forms
├── game-ui/         # Energy/burnout bars
└── layout/          # App shell and navigation
```

---

## CI/CD

GitHub Actions workflows run automatically on pushes and pull requests to `main`:

- **Backend** (`.github/workflows/backend.yml`): Ruff → Mypy → Pytest
- **Frontend** (`.github/workflows/frontend.yml`): ESLint → TypeScript → Next.js build
