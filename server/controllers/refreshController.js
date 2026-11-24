import { startScrapeJob, isScrapeRunning } from "../scraper/scrapeJob.js";

export async function refresh(req, res) {
  if (await isScrapeRunning()) return res.json({ started: false, message: "Already fetching reviews" });

  startScrapeJob();
  res.json({ started: true, message: "Fetching new reviews" });
}
