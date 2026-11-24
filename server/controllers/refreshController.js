import { settings } from "../config/settings.js";
import { startScrapeJob, isScrapeRunning } from "../scraper/scrapeJob.js";

export async function refresh(req, res) {
  if (!settings.scraperEnabled) return res.json({ started: false, message: "Fetching is turned off on this server" });
  if (await isScrapeRunning()) return res.json({ started: false, message: "Already fetching reviews" });

  startScrapeJob();
  res.json({ started: true, message: "Fetching new reviews" });
}
