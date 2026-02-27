# HouseShow

Monorepo for the HouseShow frontend and backend.

## Structure
- `apps/web` – Vite frontend
- `apps/api` – Fastify + Prisma backend
- `docker-compose.yml` – Postgres for local development

## Setup
```bash
npm install
```

## Local Development
Start Postgres:
```bash
docker compose up -d
```

Start both frontend and backend:
```bash
npm run dev
```

Or run individually:
```bash
npm run dev:web
npm run dev:api
```

Frontend: http://localhost:5173
Backend: http://localhost:3001/health

## Environment
Copy `.env.example` to `.env` and/or `apps/web/.env`, `apps/api/.env` as needed.

- `VITE_API_BASE_URL` (frontend)
- `DATABASE_URL` (backend)
- `FRONTEND_ORIGIN` (backend, for CORS)
