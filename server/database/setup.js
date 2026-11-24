import fs from "fs";
import pg from "pg";
import { pool, query } from "./db.js";
import { settings } from "../config/settings.js";
import { properties } from "../config/properties.js";

async function createDatabase() {
  const url = new URL(settings.databaseUrl);
  const name = url.pathname.slice(1);
  url.pathname = "/postgres";

  const client = new pg.Client({ connectionString: url.toString(), ssl: settings.databaseSsl });
  await client.connect();
  const result = await client.query("SELECT 1 FROM pg_database WHERE datname = $1", [name]);

  if (result.rowCount === 0) {
    await client.query(`CREATE DATABASE "${name}"`);
    console.log(`Created database ${name}`);
  }

  await client.end();
}

async function createTables() {
  const schema = fs.readFileSync(new URL("./schema.sql", import.meta.url), "utf8");
  await query(schema);
}

async function addProperties() {
  for (const property of properties) {
    await query(
      "INSERT INTO properties (name, slug, url) VALUES ($1, $2, $3) ON CONFLICT (slug) DO NOTHING",
      [property.name, property.slug, property.url]
    );
  }
}

await createDatabase();
await createTables();
await addProperties();

console.log("Database ready");
await pool.end();
