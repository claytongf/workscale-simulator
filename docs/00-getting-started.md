# 00 — Getting Started

Welcome to **WorkScale Simulator** — an educational open source simulator for comparing work schedules.

This guide will help you get the project running on your machine.

---

## Prerequisites

### For Docker setup (recommended)

- [Docker](https://docs.docker.com/get-docker/) (v20+)
- [Docker Compose](https://docs.docker.com/compose/install/) (v2+)

### For local development

- [Python](https://www.python.org/downloads/) 3.12+
- [Node.js](https://nodejs.org/) 18+ (22 recommended)
- npm (included with Node.js)

---

## Quick Start with Docker

```bash
# Clone the repository
git clone https://github.com/claytongf/workscale-simulator.git
cd workscale-simulator

# Copy environment files
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env.local

# Start all services
docker compose up --build
```

Access the system:

| Service | URL |
|---|---|
| Frontend | http://localhost:3000 |
| Backend API | http://localhost:8000 |
| API Docs (Swagger) | http://localhost:8000/docs |
| Health Check | http://localhost:8000/health |

Stop services:

```bash
docker compose down
```

---

## Local Development Setup

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

---

## Running Tests

### Backend

```bash
cd backend
pytest
```

### Frontend

```bash
cd frontend
npm run lint
npm run type-check
npm run build
```

---

## Next Steps

- [How to use the simulator](17-running-the-system.md)
- [API documentation](12-api.md)
- [Mathematical model](03-mathematical-model.md)
- [Architecture overview](11-architecture-and-tech-stack.md)
- [Ethics and limitations](15-ethics-and-limitations.md)
