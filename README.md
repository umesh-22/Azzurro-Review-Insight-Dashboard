# Azzurro Hotels — Guest Review Dashboard

Collects Booking.com guest reviews for four Azzurro Hotels properties and shows them in a simple dashboard for non-technical operations staff.

- **Live dashboard:** https://azzurro-review-dashboard.vercel.app
- **Live API:** https://azzurro-review-insight-dashboard.onrender.com/health

| Hotel | Booking.com page |
|---|---|
| Olympic Hotel Paddington | https://www.booking.com/hotel/au/olympic-paddington.html |
| Potts Point | https://www.booking.com/hotel/au/venus-potts-point-sydney.html |
| Central Sydney | https://www.booking.com/hotel/au/venus-surry-hills.html |
| Darling Harbour | https://www.booking.com/hotel/au/chateau-de-venus.html |

---

## Quick start (run it on your computer)

### You need

- **Node.js 22** (20+ works)
- **PostgreSQL** running locally, or a Supabase database
- A **Groq API key** (optional, for the AI summary and translation)

### 1. Install

```bash
npm run install:all      # installs root, server and client packages
npm run browser:install  # downloads Chromium for the scraper (~150 MB, once)
```

### 2. Add your settings

```bash
cp server/.env.example server/.env
```

Open `server/.env` and fill in:

| Setting | What to put |
|---|---|
| `DATABASE_URL` | Your database, e.g. `postgres://postgres:YOUR_PASSWORD@localhost:5432/azzurro` |
| `GROQ_API_KEY` | Your Groq key (leave empty to skip AI features) |

That is all you need locally. The other settings are explained in [All settings](#all-settings).

### 3. Create the database and tables

```bash
npm run db:setup
```

This creates the database (if it does not exist), the tables and the four hotels. It is safe to run again.

### 4. Collect reviews

```bash
npm run scrape:full
```

A Chromium window opens and goes through each hotel. **Leave it open.** The first run collects around 9,000 reviews and takes 1–2 hours.

### 5. Start the app

```bash
npm run dev
```

Open **http://localhost:5173**. The API runs at http://localhost:4000.

---

## Everyday commands

| Command | What it does |
|---|---|
| `npm run dev` | Start the dashboard and the API |
| `npm run scrape` | Fetch **new** reviews only (about a minute) |
| `npm run scrape:full` | Go through every page for every hotel |
| `npm run scrape:gaps` | Fill missing reviews in the middle of a hotel's list |
| `npm run classify` | Tag reviews with topics (normally automatic, only needed if a collection was interrupted) |
| `npm run export` | Save all reviews to `data/sample_reviews.csv` |
| `npm run db:copy` | Copy local data to the production database (`PROD_DB`). Safe to repeat. |

Collect one hotel only: `node server/scripts/scrape.js --hotel=chateau-de-venus`

---

## All settings

**Server** (`server/.env`):

| Setting | Needed | Purpose |
|---|---|---|
| `DATABASE_URL` | yes | Database connection. Local or Supabase. SSL turns on automatically for anything that is not localhost. |
| `GROQ_API_KEY` | no | Turns on the AI summary and translation |
| `GROQ_MODEL` | no | Summary model (default `openai/gpt-oss-120b`) |
| `GROQ_TRANSLATE_MODEL` | no | Translation model (default `openai/gpt-oss-20b`) |
| `PORT` | no | API port (default `4000`) |
| `ALLOWED_ORIGINS` | no | Websites allowed to call the API, comma separated (default: localhost and the Vercel site) |
| `SCRAPER_ENABLED` | no | Set to `false` on hosted servers. Hides the Fetch button. |
| `PROD_DB` | no | Production (Supabase) database, used only by `npm run db:copy` |
| `PLAYWRIGHT_BROWSERS_PATH` | no | Only if Chromium is installed in a custom folder |

**Dashboard** (`client/.env` or Vercel settings):

| Setting | Needed | Purpose |
|---|---|---|
| `VITE_API_URL` | only when deployed | The API address, e.g. `https://azzurro-review-insight-dashboard.onrender.com`. Leave empty locally. |

`.env` files are git-ignored. No passwords, API keys or cookies are committed.

---

## Deployment

| Part | Service | Settings |
|---|---|---|
| Database | Supabase | Use the **Session pooler** connection string |
| API | Render | Root `server` · Build `npm install` · Start `npm start` · Env: `DATABASE_URL`, `GROQ_API_KEY`, `NODE_VERSION=22`, `SCRAPER_ENABLED=false` |
| Dashboard | Vercel | Root `client` · Build `npm run build` · Output `dist` · Env: `VITE_API_URL` |

Hosted servers have no desktop or browser, so **review collection runs on a local computer** and is then copied to production:

```bash
npm run scrape      # collect new reviews locally
npm run db:copy     # send them to Supabase
```

---

