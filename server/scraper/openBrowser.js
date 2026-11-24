import { fileURLToPath } from "url";
import "../config/settings.js";
import { chromium } from "playwright";

const profileFolder = fileURLToPath(new URL("../.browser-profile/", import.meta.url));

export async function openBrowser() {
  const browser = await chromium.launchPersistentContext(profileFolder, {
    headless: false,
    locale: "en-GB",
    viewport: { width: 1366, height: 900 },
    args: ["--disk-cache-size=50000000"]
  });
  return browser;
}

export async function openTab(browser) {
  const page = await browser.newPage();
  const oldTabs = browser.pages().filter((tab) => tab !== page);
  await Promise.all(oldTabs.map((tab) => tab.close().catch(() => {})));
  return page;
}
