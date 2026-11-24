import pg from "pg";
import { settings } from "../config/settings.js";

pg.types.setTypeParser(1082, (value) => value);

export const pool = new pg.Pool({ connectionString: settings.databaseUrl });

export async function query(sql, params) {
  const result = await pool.query(sql, params);
  return result.rows;
}
