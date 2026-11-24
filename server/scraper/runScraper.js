import fs from "fs";
import { fileURLToPath } from "url";
import { query } from "../database/db.js";
import { openBrowser, openTab } from "./openBrowser.js";
import { openReviews, sortReviews, goToNextPage, hasNextPage } from "./collectReviews.js";
import { mapReview, isValidReview } from "./mapReview.js";
import { saveReviews } from "./saveReviews.js";
import { startRun, finishRun, failRun } from "./runLog.js";

const debugFolder = fileURLToPath(new URL("../debug/", import.meta.url));

function shortError(error) {
  return error.message.split("\n")[0];
}

function pause() {
  const seconds = 2 + Math.random() * 3;
  return new Promise((resolve) => setTimeout(resolve, seconds * 1000));
}

async function saveScreenshot(page, property) {
  fs.mkdirSync(debugFolder, { recursive: true });
  await page.screenshot({ path: `${debugFolder}${property.slug}-${Date.now()}.png` }).catch(() => {});
}

async function collectPages(page, property, counts, options) {
  async function save(cards) {
    const reviews = cards.map(mapReview).filter(isValidReview);
    const inserted = await saveReviews(reviews, property.id);
    counts.found += reviews.length;
    counts.inserted += inserted;
    return inserted;
  }

  function keepGoing(inserted, foundNew) {
    return options.fullScan || inserted > 0 || (options.fillGap && !foundNew);
  }

  await openReviews(page, property.url);
  let inserted = await save(await sortReviews(page, options.order));
  let foundNew = inserted > 0;

  while (keepGoing(inserted, foundNew) && (await hasNextPage(page))) {
    await pause();
    inserted = await save(await goToNextPage(page));
    foundNew = foundNew || inserted > 0;
  }
}

async function scrapeProperty(browser, property, counts, options) {
  const page = await openTab(browser);
  try {
    await collectPages(page, property, counts, options);
  } catch (error) {
    await saveScreenshot(page, property);
    throw error;
  }
}

async function scrapeWithRetry(browser, property, options, attempts = 3) {
  const counts = { found: 0, inserted: 0 };

  for (let attempt = 1; attempt < attempts; attempt++) {
    try {
      await scrapeProperty(browser, property, counts, { ...options, fillGap: options.fillGap || attempt > 1 });
      return counts;
    } catch (error) {
      console.log(`${property.name}: attempt ${attempt} failed (${shortError(error)}), retrying from where it stopped`);
      await pause();
    }
  }

  try {
    await scrapeProperty(browser, property, counts, { ...options, fillGap: true });
  } catch (error) {
    error.counts = counts;
    throw error;
  }
  return counts;
}

async function failAll(properties, error) {
  for (const property of properties) {
    await failRun(await startRun(property.id), error);
  }
  console.log(`Could not open the browser (${shortError(error)})`);
  throw error;
}

export async function runScraper({ fullScan = false, fillGap = false, order = "NEWEST_FIRST", hotel = null } = {}) {
  const properties = await query("SELECT * FROM properties WHERE $1::text IS NULL OR slug = $1 ORDER BY id", [hotel]);
  const browser = await openBrowser().catch((error) => failAll(properties, error));
  const results = [];

  for (const property of properties) {
    const runId = await startRun(property.id);
    try {
      const counts = await scrapeWithRetry(browser, property, { fullScan, fillGap, order });
      await finishRun(runId, counts);
      results.push({ property: property.name, ...counts });
      console.log(`${property.name}: ${counts.found} found, ${counts.inserted} new`);
    } catch (error) {
      await failRun(runId, error, error.counts);
      results.push({ property: property.name, error: shortError(error) });
      console.log(`${property.name}: failed (${shortError(error)})`);
    }
    await pause();
  }

  await browser.close();
  return results;
}
