import { query } from "../database/db.js";

export async function startRun(propertyId) {
  const rows = await query("INSERT INTO scrape_runs (property_id) VALUES ($1) RETURNING id", [propertyId]);
  return rows[0].id;
}

export async function finishRun(runId, counts) {
  await query(
    `UPDATE scrape_runs
     SET finished_at = now(), found = $2, inserted = $3,
         status = CASE WHEN $2 > 0 THEN 'success' ELSE 'needs_attention' END
     WHERE id = $1`,
    [runId, counts.found, counts.inserted]
  );
}

export async function failRun(runId, error, counts = { found: 0, inserted: 0 }) {
  await query(
    `UPDATE scrape_runs
     SET finished_at = now(), found = $3, inserted = $4, error = $2,
         status = CASE WHEN $4 > 0 THEN 'partial' ELSE 'failed' END
     WHERE id = $1`,
    [runId, error.message.split("\n")[0], counts.found, counts.inserted]
  );
}
