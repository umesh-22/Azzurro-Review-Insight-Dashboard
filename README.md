# Azzurro Hotels — Guest Review Dashboard

A working application that collects Booking.com guest reviews for four Azzurro Hotels properties and turns them into a simple dashboard for non-technical operations staff.

---

## 1. Setup and installation

### Requirements

| Tool | Version | Notes |
|---|---|---|
| Node.js | 20 or newer | Tested on Node 22 |
| PostgreSQL | 14 or newer | Tested on PostgreSQL 18, running locally |
| A desktop session | – | The scraper opens a visible browser window (see [limitations](#8-known-limitations)) |
| Groq API key | optional | Needed only for the AI summary and translation. Everything else works without it. |

### Steps

```bash
# 1. Install all dependencies (root, server and client)
npm run install:all

# 2. Download the Chromium browser used by the scraper (about 150 MB, one time)
npm run browser:install

# 3. Create your environment file and fill in your PostgreSQL password
cp server/.env.example server/.env

# 4. Create the database, tables and the four properties
npm run db:setup
```

`npm run db:setup` creates the database named in `DATABASE_URL` if it does not exist, so you do not need to create it by hand. It is safe to run more than once.

### Environment variables (`server/.env`)

| Variable | Required | Example | Purpose |
|---|---|---|---|
| `DATABASE_URL` | yes | `postgres://postgres:secret@localhost:5432/azzurro` | PostgreSQL connection |
| `PORT` | no | `4000` | API port |
| `GROQ_API_KEY` | no | – | Enables the AI summary and translation |
| `GROQ_MODEL` | no | `openai/gpt-oss-120b` | Model used for summaries |
| `GROQ_TRANSLATE_MODEL` | no | `openai/gpt-oss-20b` | Model used for translation |
| `PLAYWRIGHT_BROWSERS_PATH` | no | `D:/ms-playwright` | Only if Chromium is installed outside the default folder |

`server/.env` is git-ignored. No passwords, API keys or cookies are committed.

---

## 2. How to run the scraper and the dashboard

### Collect reviews

```bash
npm run scrape        # fetch new reviews only (fast, stops at reviews already saved)
npm run scrape:full   # go through every page for every hotel (first run, or to fill gaps)
```

A Chromium window opens and visits each hotel in turn. Leave it open until the terminal prints a line for each hotel. The first full run collects about 10,000 reviews and takes 1–2 hours. Later runs take a few seconds per hotel.

After collecting, reviews are tagged with topics automatically. To re-run the tagging on its own:

```bash
npm run classify
```

### Start the dashboard

```bash
npm run dev
```

| What | Address |
|---|---|
| Dashboard | http://localhost:5173 |
| API | http://localhost:4000/api |

`npm run dev` starts the API (with nodemon) and the React app (with Vite) together.

### Fetching new reviews from the dashboard

- Staff press **Fetch new reviews** in the sidebar. There is no automatic schedule; collection only runs when someone asks for it.
- The button shows "Fetching…" while it runs, then the result: "✅ Last fetch added 12 new reviews" or "❌ Last fetch had a problem. See Data status."
- The browser opens **on the computer running the API**, so the API must run on a machine with a desktop session (see [limitations](#8-known-limitations)).

### Export sample data

```bash
npm run export        # writes data/sample_reviews.csv
```

### Deployment (Vercel + Render + Supabase)

| Part | Where | Settings |
|---|---|---|
| Database | Supabase | Use the **Session pooler** connection string. SSL is switched on automatically. |
| API | Render | Root `server`, build `npm install`, start `npm start`. Env: `DATABASE_URL` (Supabase), `GROQ_API_KEY`, `NODE_VERSION=22`, `SCRAPER_ENABLED=false` |
| Dashboard | Vercel | Root `client`, build `npm run build`, output `dist`. Env: `VITE_API_URL` = the Render URL |

Hosted servers have no desktop, so review collection runs on a local computer:

```bash
npm run scrape        # collect new reviews into the local database
npm run db:copy       # copy them to Supabase (PROD_DB); safe to repeat
```

---

