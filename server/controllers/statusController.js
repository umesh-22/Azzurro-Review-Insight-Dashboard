import { getStatus, getProperties } from "../queries/status.js";
import { isScrapeRunning } from "../scraper/scrapeJob.js";

export async function status(req, res) {
  res.json({ running: await isScrapeRunning(), properties: await getStatus() });
}

export async function properties(req, res) {
  res.json(await getProperties());
}
