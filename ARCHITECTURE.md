# EKart — End-to-End Architecture

This document explains the entire system — what it is, how the pieces fit together, and how data
flows through it — in enough detail that someone (or some LLM) with zero prior context on this
repo can pick it up and work on it correctly. If you are an LLM being asked to modify this repo,
read this file first.

## 1. What this project is (and isn't)

EKart is a small e-commerce demo. The explicit design goals, in the project owner's words:

- **Not** a clone of Amazon-style e-commerce UX. The frontend should be visually bold, animated,
  and "cool" — glassmorphism, custom cursor, tilt cards, page transitions, confetti, etc.
- The **backend should stay simple/thin**. No heavy business logic, no microservices, no queues.
- **Auth is intentionally hardcoded** — one admin/admin123-style credential pair, no OAuth, no
  user registration, no password hashing complexity. This is a deliberate simplicity choice, not
  an oversight.
- **Payments are fake.** There is no Stripe/Razorpay/PayPal integration. Checkout collects a
  shipping address and card-shaped form fields, and the "payment" is just an order document
  written to MongoDB with the card number masked to its last 4 digits. Nothing is charged,
  nothing is verified.
- **Cart state lives in the browser** (`localStorage`, via Zustand's `persist` middleware), not
  on the server. There is no cart API.
- Currency is **INR (₹)**, formatted with `Intl.NumberFormat("en-IN", ...)`.
- **MongoDB must never be installed locally.** It only ever runs inside Docker. This is a hard
  constraint from the project owner, mentioned more than once.
- The project is meant to be **deployable for free** eventually (frontend on Vercel/Netlify,
  backend on Render/Fly.io, DB on MongoDB Atlas free tier). Nothing should be hardcoded in a way
  that blocks that — all URLs/secrets are environment-variable driven.

## 2. Tech stack

| Layer | Choice |
|---|---|
| Frontend | React 18 + Vite + TypeScript + Tailwind CSS + Framer Motion + Zustand + React Router + Axios + lucide-react icons + canvas-confetti |
| Backend | Node.js + Express + TypeScript + Mongoose |
| Database | MongoDB 7 (Docker only) |
| DB viewer | `mongo-express` (prebuilt Docker image — no custom code, no local Mongo client) |
| Dev orchestration | Docker Compose (hot-reload volumes, no local Node/Mongo install required) |

## 3. Repository layout

```
EKart/
├── docker-compose.yml        # mongo + backend + frontend + mongo-express, dev mode
├── .env.example               # every env var this repo reads, with safe defaults
├── README.md                   # quick-start instructions
├── ARCHITECTURE.md             # this file
│
├── backend/
│   ├── Dockerfile
│   ├── package.json
│   ├── tsconfig.json
│   └── src/
│       ├── index.ts                # entrypoint: connect DB, start Express
│       ├── app.ts                  # Express app: middleware + route mounting
│       ├── config/
│       │   ├── env.ts              # reads all process.env into one typed object
│       │   └── db.ts               # mongoose.connect()
│       ├── constants/index.ts      # HTTP status codes, ORDER_STATUS, JWT_EXPIRES_IN
│       ├── types/index.ts          # shared request/response/JWT payload types
│       ├── middleware/
│       │   ├── auth.middleware.ts  # requireAuth: verifies Bearer JWT
│       │   └── error.middleware.ts # AppError class + centralized error handler
│       ├── models/
│       │   ├── product.model.ts    # Product schema
│       │   └── order.model.ts      # Order schema (embeds items/shipping)
│       ├── services/               # business logic, one file per resource
│       │   ├── auth.service.ts
│       │   ├── product.service.ts
│       │   └── order.service.ts
│       ├── controllers/            # thin HTTP glue calling services
│       │   ├── auth.controller.ts
│       │   ├── product.controller.ts
│       │   └── order.controller.ts
│       ├── routes/                 # Express routers, one per resource + index
│       ├── utils/
│       │   ├── jwt.ts              # sign/verify helpers
│       │   └── asyncHandler.ts     # wraps async controllers so thrown errors reach Express
│       └── seed/
│           ├── products.seed.ts    # the 20 hardcoded product records
│           └── index.ts            # `npm run seed` entrypoint — wipes & reinserts products
│
└── frontend/
    ├── Dockerfile
    ├── package.json
    ├── vite.config.ts
    ├── tailwind.config.js
    ├── index.html               # has %VITE_SITE_NAME% placeholder in <title>
    └── src/
        ├── main.tsx              # ReactDOM root, wraps App in BrowserRouter
        ├── App.tsx               # route table + persistent chrome (Navbar/Footer/CartDrawer/background/cursor)
        ├── index.css             # Tailwind layers + glass/gradient/cursor utility classes
        ├── constants/index.ts    # API_BASE_URL, SITE_NAME, CREATOR_NAME, CURRENCY, CATEGORIES...
        ├── types/index.ts        # Product, CartItem, Order, Shipping/Payment detail types
        ├── lib/
        │   ├── api.ts            # axios instance; injects Authorization header from auth store
        │   └── format.ts         # formatPrice() — the one place currency formatting happens
        ├── store/
        │   ├── authStore.ts      # zustand+persist: { token, username }
        │   └── cartStore.ts      # zustand+persist: cart items, drawer open/close, selectors
        ├── components/
        │   ├── AnimatedBackground.tsx  # fixed gradient blobs + grid + noise overlay
        │   ├── CustomCursor.tsx        # spring-follow dot+ring cursor (pointer:fine only)
        │   ├── Navbar.tsx               # sticky glass nav, cart badge, login/logout
        │   ├── Footer.tsx               # site name + creator name, both env-driven
        │   ├── CartDrawer.tsx           # slide-in cart panel (AnimatePresence)
        │   ├── ProductCard.tsx          # 3D tilt + spotlight hover card
        │   ├── ProtectedRoute.tsx       # redirects to /login if no auth token
        │   ├── PageTransition.tsx       # fade/slide wrapper used per-route
        │   └── Loader.tsx
        └── pages/
            ├── HomePage.tsx
            ├── ProductsPage.tsx         # category filter + grid
            ├── ProductDetailPage.tsx
            ├── LoginPage.tsx
            ├── CheckoutPage.tsx          # 3-step wizard: Shipping → Payment → Review
            ├── OrderSuccessPage.tsx      # confetti + order summary
            ├── OrdersPage.tsx            # order history
            └── NotFoundPage.tsx
```

## 4. Data models

### Product (`backend/src/models/product.model.ts`)

```ts
{
  name: string
  description: string
  price: number          // in rupees, whole numbers (e.g. 2499 = ₹2,499)
  category: string        // "Tech" | "Audio" | "Wearables" | "Home" | "Gaming" | "Clothing" | "Jewellery"
  image: string           // URL (picsum.photos placeholder images, seeded deterministically)
  accentColor: string     // hex color used for the tag pill + hover spotlight tint
  tag?: string            // optional badge, e.g. "New" | "Bestseller"
  createdAt, updatedAt    // via { timestamps: true }
}
```

There are 20 seed products across 7 categories (`backend/src/seed/products.seed.ts`). Products are
read-only from the frontend's perspective — there is no admin UI to create/edit products; they
only change via editing the seed file and re-running `npm run seed`.

### Order (`backend/src/models/order.model.ts`)

```ts
{
  username: string          // from the JWT of whoever placed the order (always "admin" today)
  items: [{ productId, name, price, image, quantity }]
  shipping: { fullName, address, city, postalCode, phone }
  cardLast4: string          // last 4 digits only — never store the full card number
  cardholderName: string
  total: number               // computed server-side from items, never trusted from client blindly
  status: string               // always "PAID" — there is no real payment gateway to fail
  createdAt, updatedAt
}
```

## 5. End-to-end flows

### 5.1 Authentication flow

1. User opens `/login`, submits a username/password form.
2. Frontend calls `POST /api/auth/login` with `{ username, password }`.
3. Backend (`auth.service.ts`) compares against `env.adminUsername` / `env.adminPassword` (from
   `ADMIN_USERNAME` / `ADMIN_PASSWORD` env vars, defaulting to `admin` / `admin123`). No database
   lookup, no bcrypt — this is intentional.
4. On match, backend signs a JWT (`{ username }` payload, 7-day expiry, secret = `JWT_SECRET`) and
   returns `{ token, username }`.
5. Frontend stores `{ token, username }` in `authStore` (Zustand, persisted to `localStorage` under
   key `ekart_auth`).
6. Every subsequent `axios` request (via `frontend/src/lib/api.ts`'s request interceptor) attaches
   `Authorization: Bearer <token>` automatically by reading the token out of `authStore`.
7. Protected frontend routes (`/checkout`, `/orders`, `/order-success/:id`) are wrapped in
   `<ProtectedRoute>`, which redirects to `/login` if there's no token in `authStore` — this is a
   client-side UX guard only.
8. The real enforcement is server-side: `requireAuth` middleware (`auth.middleware.ts`) is mounted
   on the entire `/api/orders` router. It reads the `Authorization` header, verifies the JWT with
   `JWT_SECRET`, and attaches `req.user = { username }`. Missing/invalid token → `401`.

There is no logout endpoint — "logging out" just clears the local auth store.

### 5.2 Browsing products flow

1. `ProductsPage` / `HomePage` call `GET /api/products` (no auth required — public endpoint).
2. Backend returns all products, sorted by `createdAt` ascending.
3. `ProductsPage` filters client-side by category (`CATEGORIES` constant) — no server-side
   filtering/pagination exists; with 20 products this is fine and deliberately simple.
4. `ProductDetailPage` calls `GET /api/products/:id`.

### 5.3 Cart flow (entirely client-side)

1. Adding a product (`ProductCard` "Add" button, or `ProductDetailPage`) calls
   `cartStore.addItem(product)`. If the product is already in the cart, its quantity increments;
   otherwise a new `CartItem` is appended. Adding an item also opens the cart drawer.
2. `cartStore` is a Zustand store with the `persist` middleware, `partialize`d to only persist
   `items` (not the drawer-open UI state), under `localStorage` key `ekart_cart`.
3. The cart drawer (`CartDrawer.tsx`) reads `cartStore.items`, lets the user
   increment/decrement/remove items, and shows a running subtotal via the `selectCartTotal`
   selector.
4. **There is no backend cart API.** The cart only becomes a server-side concern at checkout time,
   when its contents are submitted as part of the order payload.

### 5.4 Checkout / "payment" flow

1. `/checkout` is a protected route — if there's no auth token, the user is bounced to `/login`
   first (and returned to `/checkout` after logging in, via React Router's `location.state.from`).
2. `CheckoutPage` is a 3-step wizard (`Shipping` → `Payment` → `Review`), each step a local
   `useState` step index, animated with Framer Motion `AnimatePresence`.
   - **Shipping step**: collects `{ fullName, address, city, postalCode, phone }`.
   - **Payment step**: collects `{ cardholderName, cardNumber, expiry, cvv }`. The card number is
     auto-formatted into groups of 4 digits client-side. **`cvv` is intentionally never sent to
     the backend** — it's collected only for UI realism and discarded.
   - **Review step**: shows a summary and triggers the actual order submission on click.
3. On submit, frontend calls `POST /api/orders` with:
   ```json
   {
     "items": [{ "productId", "name", "price", "image", "quantity" }, ...],
     "shipping": { "fullName", "address", "city", "postalCode", "phone" },
     "payment": { "cardholderName", "cardNumber", "expiry" }
   }
   ```
   (requires `Authorization: Bearer <token>`, attached automatically by the axios interceptor).
4. Backend (`order.service.ts::createOrder`):
   - Rejects if `items` is empty (`400`).
   - Recomputes `total` server-side from `items` (never trusts a client-sent total).
   - Masks the card: `cardLast4 = cardNumber.replace(/\s+/g, "").slice(-4)`. The full card number
     is never persisted.
   - Saves an `Order` document with `status: "PAID"` (there is no failure path — this is a mock
     payment, not a real gateway integration).
5. Frontend clears the cart (`cartStore.clearCart()`) and navigates to `/order-success/:id`.
6. `OrderSuccessPage` fires a `canvas-confetti` burst, fetches the order via
   `GET /api/orders/:id`, and displays a summary.
7. `/orders` (`OrdersPage`) lists all past orders for the current JWT's username via
   `GET /api/orders`.

### 5.5 Currency formatting

All prices are plain numbers (rupees, no paise/decimals) both in MongoDB and over the wire. The
**only** place currency formatting happens is `frontend/src/lib/format.ts`'s `formatPrice()`,
which wraps `Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" })`. Every page/
component imports `formatPrice` rather than formatting inline — if you add a new place that shows
a price, use this helper, don't hand-roll `₹${x}`.

## 6. API reference

Base path: `/api` (see `backend/src/routes/index.ts`). All bodies are JSON.

| Method | Path | Auth? | Body | Returns |
|---|---|---|---|---|
| POST | `/auth/login` | No | `{ username, password }` | `{ token, username }` or `401` |
| GET | `/products` | No | — | `Product[]` |
| GET | `/products/:id` | No | — | `Product` or `404` |
| POST | `/orders` | **Yes** | `{ items, shipping, payment }` | created `Order` (`201`) |
| GET | `/orders` | **Yes** | — | `Order[]` for the current user, newest first |
| GET | `/orders/:id` | **Yes** | — | `Order` (only if it belongs to the current user) or `404` |
| GET | `/health` (not under `/api`) | No | — | `{ status: "ok" }` |

Auth is a `Bearer <jwt>` header, checked by `requireAuth` middleware. All errors go through a
single `errorHandler` middleware and return `{ message: string }` with an appropriate status code.

## 7. Environment variables

All defaults live in `docker-compose.yml` (via `${VAR:-default}` syntax) and are documented in
`.env.example` at the repo root — copy it to `.env` to override anything; Docker Compose reads
`.env` automatically.

| Variable | Used by | Default | Purpose |
|---|---|---|---|
| `PORT` | backend | `5000` | Express listen port |
| `MONGO_URI` | backend | `mongodb://mongo:27017/ekart` | Mongo connection string (points at the `mongo` service name inside Docker) |
| `JWT_SECRET` | backend | `ekart-dev-secret-change-me` | JWT signing secret — **change this for any real deployment** |
| `ADMIN_USERNAME` / `ADMIN_PASSWORD` | backend | `admin` / `admin123` | The one hardcoded login |
| `CORS_ORIGIN` | backend | `http://localhost:5174` | Allowed origin for the Express `cors()` middleware |
| `VITE_API_URL` | frontend | `http://localhost:5000/api` | Where the frontend's axios client points |
| `VITE_SITE_NAME` | frontend | `EKart` | Site name shown in the navbar, footer, and `<title>` (via `%VITE_SITE_NAME%` in `index.html`) |
| `VITE_CREATOR_NAME` | frontend | `Ritu Anand` | Name shown in the footer's "Built with ♥ by ..." line |
| `MONGO_EXPRESS_USERNAME` / `MONGO_EXPRESS_PASSWORD` | mongo-express | `admin` / `admin123` | Basic-auth login for the DB viewer UI |

**Important Vite caveat**: `VITE_*` vars are read at dev-server-start / build time, not true
runtime config. In Docker dev mode this just means "restart the frontend container" after
changing them. For a production static build (Vercel/Netlify), they must be set in that
platform's build-time environment settings, not changed after the fact.

## 8. Docker dev setup

`docker-compose.yml` defines four services:

- **`mongo`** (`mongo:7`) — the only place MongoDB runs; there is a named volume `mongo-data` so
  data survives container recreation. Has a healthcheck (`db.runCommand("ping")`); `backend`
  waits for it to be healthy before starting.
- **`backend`** — builds `backend/Dockerfile`, runs `npm run dev` (`ts-node-dev` with
  `--respawn --transpile-only --poll`, using `--poll` because Docker Desktop bind-mount file
  events aren't always reliable across the VM boundary). `./backend/src` is bind-mounted for hot
  reload.
- **`frontend`** — builds `frontend/Dockerfile`, runs `vite --host`. `./frontend/src` and
  `./frontend/index.html` are bind-mounted for hot reload.
- **`mongo-express`** — a stock `mongo-express` image pointed at the `mongo` service, exposing a
  full point-and-click Mongo admin UI at `http://localhost:8081` (basic-auth protected). This
  exists so nobody needs to install `mongosh`/Compass/any Mongo client locally to inspect data —
  it's literally a web frontend for the database. It was chosen over building a custom viewer
  because it's a maintained, zero-code, prebuilt solution — exactly matching what was asked
  ("look at Mongo entries without installing a client"), with less surface area than writing and
  maintaining a bespoke admin page.

All ports are explicitly bound to `127.0.0.1` (e.g. `127.0.0.1:5174:5173`), not left as bare
`5174:5173`. This was a deliberate fix: on this dev machine, plain `HOST_PORT:CONTAINER_PORT`
publishes on both `0.0.0.0` and `::` (IPv6), and `localhost` can resolve to `::1` first. If
something else on the host happens to already be listening on that same port over IPv6 (which
happened during development — an unrelated project's native Vite server was squatting on 5173),
requests silently hit the wrong process. Binding explicitly to `127.0.0.1` avoids ever depending on
IPv6 loopback resolution.

**Ports**: frontend `5174` (chosen instead of Vite's default `5173` specifically to avoid clashing
with other local dev servers), backend `5000`, mongo `27017`, mongo-express `8081`.

Common commands:

```bash
docker compose up --build -d        # build + start everything
docker compose exec backend npm run seed   # (re)seed the 20 products — wipes the Product collection first
docker compose logs -f backend      # tail logs
docker compose down                 # stop (add -v to also wipe the mongo-data volume)
```

## 9. Deployment plan (not yet executed)

Structured so each piece moves to a free tier independently, with no code changes:

- **Frontend** → Vercel or Netlify. Static build (`npm run build` → `dist/`). Set `VITE_API_URL`,
  `VITE_SITE_NAME`, `VITE_CREATOR_NAME` as build-time env vars on the platform.
- **Backend** → Render or Fly.io free tier. Already Dockerized (`backend/Dockerfile`); for
  production you'd want a `CMD` that runs the compiled `dist/index.js` (`npm run build && npm
  start`) rather than `ts-node-dev`, and to set `MONGO_URI`, `JWT_SECRET`, `ADMIN_USERNAME`,
  `ADMIN_PASSWORD`, `CORS_ORIGIN` (pointed at the deployed frontend URL) as env vars.
- **Database** → MongoDB Atlas free tier (M0 cluster). Swap `MONGO_URI` to the Atlas connection
  string. Run `npm run seed` once against it (locally, pointing `MONGO_URI` at Atlas) to populate
  products.
- **DB viewer** (`mongo-express`) is a dev-only convenience — it is not meant to be deployed
  publicly; use MongoDB Atlas's own web UI in production instead.

## 10. Deliberate non-features (don't "fix" these)

If you're an LLM asked to improve this codebase, do **not** add the following unless explicitly
asked — they are scope decisions, not gaps:

- Real payment gateway integration (Stripe/Razorpay/etc.)
- Password hashing / multi-user accounts / registration / OAuth
- Server-side cart persistence or a cart API
- Product search, pagination, or admin CRUD UI for products
- Order cancellation/refund flows
- Automated tests (none exist yet; if asked to add them, keep them proportional to this project's
  simplicity — don't introduce a heavy test framework/mocking setup for a demo app)
