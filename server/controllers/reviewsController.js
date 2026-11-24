import { getReviews, getAllReviews } from "../queries/reviews.js";
import { readFilters } from "../queries/filters.js";
import { toCsv } from "../utils/csv.js";

export async function reviews(req, res) {
  res.json(await getReviews(readFilters(req)));
}

export async function exportReviews(req, res) {
  const rows = await getAllReviews(readFilters(req));
  res.attachment("reviews.csv");
  res.type("text/csv").send(toCsv(rows));
}
