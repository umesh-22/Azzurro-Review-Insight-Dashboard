import { query } from "../database/db.js";
import { languageName } from "../config/languages.js";

export async function getLanguages() {
  const rows = await query("SELECT coalesce(language, 'und') AS code, count(*)::int AS count FROM reviews GROUP BY 1");
  const groups = Object.groupBy(rows, (row) => languageName(row.code));

  return Object.entries(groups)
    .map(([name, items]) => ({
      name,
      codes: items.map((item) => item.code).join(","),
      count: items.reduce((sum, item) => sum + item.count, 0)
    }))
    .sort((a, b) => b.count - a.count);
}
