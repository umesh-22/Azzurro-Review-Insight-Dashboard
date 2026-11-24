import { query } from "../database/db.js";

const statusSql = `
  SELECT p.id, p.name AS property,
         run.started_at AS "lastRun", run.status, run.inserted AS "newReviews", run.error,
         (SELECT count(*)::int FROM reviews WHERE property_id = p.id) AS "totalReviews",
         (SELECT max(scraped_at) FROM reviews WHERE property_id = p.id) AS "lastUpdated"
  FROM properties p
  LEFT JOIN LATERAL (
    SELECT * FROM scrape_runs s WHERE s.property_id = p.id ORDER BY s.started_at DESC LIMIT 1
  ) run ON true
  ORDER BY p.id
`;

export function getStatus() {
  return query(statusSql);
}

export function getProperties() {
  return query("SELECT id, name, url FROM properties ORDER BY id");
}
