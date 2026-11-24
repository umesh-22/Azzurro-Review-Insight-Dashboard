import { getOverview } from "../queries/overview.js";
import { readFilters } from "../queries/filters.js";

export async function overview(req, res) {
  res.json(await getOverview(readFilters(req)));
}
