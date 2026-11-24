import fs from "fs";
import { pool } from "../database/db.js";
import { getAllReviews } from "../queries/reviews.js";
import { toCsv } from "../utils/csv.js";

const folder = new URL("../../data/", import.meta.url);
const rows = await getAllReviews({ property: null, from: null, to: null, topic: null, sentiment: null, search: null });

fs.mkdirSync(folder, { recursive: true });
fs.writeFileSync(new URL("sample_reviews.csv", folder), toCsv(rows));

console.log(`Exported ${rows.length} reviews to data/sample_reviews.csv`);
await pool.end();
