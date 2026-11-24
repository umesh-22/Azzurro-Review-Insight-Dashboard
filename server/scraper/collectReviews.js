const readAllButton = '[data-testid="fr-read-all-reviews"]';
const sortSelect = '[data-testid="reviews-sorter-component"]';
const nextButton = 'button[aria-label="Next page"]';

function waitForReviews(page) {
  return page
    .waitForResponse((response) => (response.request().postData() || "").includes('"ReviewList"'), { timeout: 60000 })
    .then((response) => response.json())
    .then((json) => json.data.reviewListFrontend.reviewCard);
}

export async function openReviews(page, url) {
  await page.goto(url, { waitUntil: "domcontentloaded", timeout: 60000 });
  await page.waitForSelector(readAllButton, { timeout: 60000 });
  await page.waitForLoadState("load");
  await page.waitForTimeout(3000);
  await page.locator(readAllButton).first().click();
  await page.waitForSelector(sortSelect, { timeout: 30000 });
}

export async function sortReviews(page, order) {
  const [reviews] = await Promise.all([waitForReviews(page), page.selectOption(sortSelect, order)]);
  return reviews;
}

async function clickNext(page) {
  const [reviews] = await Promise.all([waitForReviews(page), page.locator(nextButton).click({ timeout: 30000 })]);
  return reviews;
}

export async function goToNextPage(page) {
  for (let attempt = 1; attempt < 3; attempt++) {
    try {
      return await clickNext(page);
    } catch {
      await page.waitForTimeout(5000);
    }
  }
  return clickNext(page);
}

export async function hasNextPage(page) {
  const button = page.locator(nextButton);
  return (await button.count()) > 0 && (await button.isEnabled());
}
