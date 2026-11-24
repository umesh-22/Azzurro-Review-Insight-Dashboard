import { getIssues } from "../queries/issues.js";
import { readFilters } from "../queries/filters.js";

export async function issues(req, res) {
  res.json(await getIssues(readFilters(req)));
}
