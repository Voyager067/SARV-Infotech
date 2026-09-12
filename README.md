# EKart

A small, UI-heavy e-commerce demo. Not trying to be Amazon — just a fun, animated shopping
experience with a deliberately lightweight backend.

**Stack:** React + Vite + TypeScript + Tailwind + Framer Motion (frontend), Node + Express +
TypeScript (backend), MongoDB (via Docker — nothing to install locally).

> Full end-to-end walkthrough (data models, request flows, API reference, env vars) lives in
> [ARCHITECTURE.md](./ARCHITECTURE.md).

## Features

- Hardcoded-credential login (`admin` / `admin123`) issuing a JWT
- 20 seeded products across Tech, Audio, Wearables, Home, Gaming, Clothing, and Jewellery
- Prices in Indian Rupees (₹)
- Cart persisted in `localStorage` (via Zustand)
- Multi-step animated checkout with a mock payment form (no real payment provider — the order,
  shipping info, and masked card details are just saved to MongoDB)
- Order history per session
- Custom cursor, tilt cards, glassmorphism, gradient blobs, page transitions, confetti on order
  success
- Site name and footer creator credit are both configurable via env vars (`VITE_SITE_NAME`,
  `VITE_CREATOR_NAME`) — no hardcoded branding in the code
- A ready-to-use web UI to browse the database (`mongo-express`) — no Mongo client install needed

## Running locally (Docker only — no local Mongo/Node needed)

```bash
cp .env.example .env   # optional, defaults work out of the box
docker compose up --build
```

- Frontend: http://localhost:5174
- Backend: http://localhost:5000/api
- **DB viewer (mongo-express)**: http://localhost:8081 (login `admin` / `admin123` by default —
  see `MONGO_EXPRESS_USERNAME` / `MONGO_EXPRESS_PASSWORD`)
- Mongo itself: exposed on localhost:27017 only if you want to point an external tool at it

Seed the product catalog (once the containers are up):

```bash
docker compose exec backend npm run seed
```

Log in with `admin` / `admin123`.

## Project layout

```
backend/    Express + TypeScript API (auth, products, orders)
frontend/   React + Vite + TypeScript client
docker-compose.yml   mongo + backend + frontend + mongo-express, dev mode with hot reload
ARCHITECTURE.md      full end-to-end system explanation
```

## Configuration

See `.env.example` for the full list. The two you're most likely to want to change:

```bash
VITE_SITE_NAME=EKart
VITE_CREATOR_NAME=Your Name
```

These are read at frontend dev-server-start / build time — restart the `frontend` container (or
rebuild for production) after changing them.

## Deploying for free (later)

This is structured so each piece can move to a free tier independently:

- **Frontend** → Vercel or Netlify (static build, set `VITE_API_URL`, `VITE_SITE_NAME`,
  `VITE_CREATOR_NAME` as build-time env vars)
- **Backend** → Render or Fly.io free tier (already Dockerized; set `MONGO_URI`, `JWT_SECRET`,
  `ADMIN_USERNAME`, `ADMIN_PASSWORD`, `CORS_ORIGIN` as env vars)
- **Database** → MongoDB Atlas free tier (M0 cluster), swap `MONGO_URI` to the Atlas connection
  string — no code changes needed

Nothing is hardcoded to `localhost` outside of default env values, so this is a config change, not
a rewrite, when you're ready to deploy.
