import { query } from "../database/db.js";

export async function health(req, res) {
  const [row] = await query("SELECT count(*)::int AS reviews FROM reviews");
  res.json({ status: "ok", database: "connected", reviews: row.reviews });
}
