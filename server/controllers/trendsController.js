import { getTrends } from "../queries/trends.js";
import { readFilters } from "../queries/filters.js";

export async function trends(req, res) {
  res.json(await getTrends(readFilters(req)));
}
