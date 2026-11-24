import { query } from "../database/db.js";
import { runScraper } from "./runScraper.js";
import { classifyNewReviews } from "../insights/classifyReview.js";

let running = false;

async function scrapeAndClassify(options) {
  await runScraper(options);
  const classified = await classifyNewReviews();
  console.log(`Classified ${classified} new reviews`);
}

async function runningElsewhere() {
  const rows = await query(
    "SELECT 1 FROM scrape_runs WHERE status = 'running' AND started_at > now() - interval '3 hours' LIMIT 1"
  );
  return rows.length > 0;
}

export async function isScrapeRunning() {
  return running || (await runningElsewhere());
}

export function startScrapeJob(options) {
  running = true;
  return scrapeAndClassify(options)
    .catch((error) => console.log(`Scrape job failed (${error.message})`))
    .finally(() => {
      running = false;
    });
}
