import { pool } from "../database/db.js";
import { classifyNewReviews } from "../insights/classifyReview.js";

const count = await classifyNewReviews();
console.log(`Classified ${count} reviews`);
await pool.end();
