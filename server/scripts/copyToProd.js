import pg from "pg";
import { pool as local } from "../database/db.js";

const prod = new pg.Pool({ connectionString: process.env.PROD_DB, ssl: { rejectUnauthorized: false } });
const batchSize = 500;

const tables = [
  {
    name: "reviews",
    onConflict: `ON CONFLICT (id) DO UPDATE SET classified = EXCLUDED.classified,
      translated_from = EXCLUDED.translated_from, translated_title = EXCLUDED.translated_title,
      translated_liked = EXCLUDED.translated_liked, translated_disliked = EXCLUDED.translated_disliked`
  },
  { name: "review_topics", onConflict: "ON CONFLICT DO NOTHING" },
  {
    name: "daily_summaries",
    onConflict: "ON CONFLICT (scope, created_on) DO UPDATE SET text = EXCLUDED.text, source = EXCLUDED.source"
  },
  {
    name: "scrape_runs",
    columns: "property_id, started_at, finished_at, status, found, inserted, error",
    onConflict: `ON CONFLICT (property_id, started_at) DO UPDATE SET finished_at = EXCLUDED.finished_at,
      status = EXCLUDED.status, found = EXCLUDED.found, inserted = EXCLUDED.inserted, error = EXCLUDED.error`
  }
];

async function copyTable(table) {
  const { rows } = await local.query(`SELECT * FROM ${table.name}`);
  const columns = table.columns || "*";
  const target = (table.columns && `${table.name} (${table.columns})`) || table.name;

  for (let start = 0; start < rows.length; start += batchSize) {
    const batch = JSON.stringify(rows.slice(start, start + batchSize));
    await prod.query(
      `INSERT INTO ${target} SELECT ${columns} FROM json_populate_recordset(null::${table.name}, $1) ${table.onConflict}`,
      [batch]
    );
  }

  console.log(`${table.name}: ${rows.length} rows copied`);
}

async function resetCounters() {
  await prod.query("SELECT setval('reviews_id_seq', (SELECT coalesce(max(id), 1) FROM reviews))");
}

for (const table of tables) {
  await copyTable(table);
}
await resetCounters();

console.log("Copy to production finished");
await local.end();
await prod.end();
