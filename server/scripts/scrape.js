import { pool } from "../database/db.js";
import { startScrapeJob, isScrapeRunning } from "../scraper/scrapeJob.js";

if (await isScrapeRunning()) {
  console.log("A review collection is already running. Try again when it finishes.");
} else {
  await startScrapeJob({ fullScan: process.argv.includes("--full") });
}

await pool.end();
