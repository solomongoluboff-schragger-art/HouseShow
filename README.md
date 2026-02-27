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

## Deployment (Vercel + Fly.io)
This repo is set up for Vercel (frontend) and Fly.io (API).

### Prereqs
- GitHub repo pushed
- Fly CLI installed and logged in

### 1) Deploy API on Fly.io
1. Launch the app from repo root:
   `fly launch --config apps/api/fly.toml`
1. Update `app = "..."` in `apps/api/fly.toml` to match the name Fly assigns.
1. Create and attach Postgres:
   `fly postgres create`
   `fly postgres attach --app <your-api-app-name>`
1. Set CORS origin:
   `fly secrets set FRONTEND_ORIGIN=https://<your-vercel-project>.vercel.app --app <your-api-app-name>`
1. Deploy:
   `fly deploy --config apps/api/fly.toml`

### 2) Deploy frontend on Vercel
1. Import the GitHub repo in Vercel.
1. Set project root to `apps/web`.
1. Set build output to `dist` and build command to `npm run build`.
1. Add `VITE_API_BASE_URL` in Vercel:
   `https://<your-fly-app-name>.fly.dev`
1. Deploy.

### 3) Automatic API deploys (GitHub Actions)
This repo includes a Fly deploy workflow. Configure these GitHub secrets:
- `FLY_API_TOKEN` (Fly API token)
- `FLY_APP_NAME` (Fly app name)

Then pushes to `main` will deploy the API automatically.
