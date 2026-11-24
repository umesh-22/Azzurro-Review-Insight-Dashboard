import { pool } from "../database/db.js";
import { startScrapeJob, isScrapeRunning } from "../scraper/scrapeJob.js";

function option(name) {
  return process.argv.find((arg) => arg.startsWith(`--${name}=`))?.split("=")[1] || null;
}

const options = {
  fullScan: process.argv.includes("--full"),
  fillGap: process.argv.includes("--fill-gap"),
  order: (process.argv.includes("--oldest") && "OLDEST_FIRST") || "NEWEST_FIRST",
  hotel: option("hotel")
};

if (await isScrapeRunning()) {
  console.log("A review collection is already running. Try again when it finishes.");
} else {
  await startScrapeJob(options);
}

await pool.end();
