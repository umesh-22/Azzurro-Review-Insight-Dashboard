import { query } from "../database/db.js";
import { scoreRules } from "../config/topics.js";
import { filterSql, filterParams } from "./filters.js";

const trendsSql = `
  SELECT to_char(date_trunc('week', r.review_date), 'YYYY-MM-DD') AS week,
         round(avg(r.score), 1)::float AS average,
         count(*)::int AS reviews,
         count(*) FILTER (WHERE r.score >= ${scoreRules.positiveFrom})::int AS positive,
         count(*) FILTER (WHERE r.score < ${scoreRules.negativeBelow})::int AS negative
  FROM reviews r
  WHERE ${filterSql}
  GROUP BY 1
  ORDER BY 1
`;

export function getTrends(filters) {
  return query(trendsSql, filterParams(filters));
}
