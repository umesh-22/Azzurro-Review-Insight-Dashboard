import { query } from "../database/db.js";
import { scoreRules } from "../config/topics.js";

const current = "($1::date IS NULL OR r.review_date >= $1)";
const previous = "r.review_date >= $2 AND r.review_date < $1";

const statsColumns = `
  round(avg(r.score) FILTER (WHERE ${current}), 1)::float AS current,
  round(avg(r.score) FILTER (WHERE ${previous}), 1)::float AS previous,
  round(avg(r.score) FILTER (WHERE ${current}) - avg(r.score) FILTER (WHERE ${previous}), 1)::float AS change,
  count(r.id) FILTER (WHERE ${current})::int AS reviews,
  count(r.id) FILTER (WHERE ${previous})::int AS "previousReviews",
  round(100.0 * count(r.id) FILTER (WHERE ${current} AND r.score < ${scoreRules.negativeBelow})
    / NULLIF(count(r.id) FILTER (WHERE ${current}), 0))::int AS "negativePercent"
`;

const topComplaintSql = `
  SELECT t.topic
  FROM review_topics t
  JOIN reviews r ON r.id = t.review_id
  WHERE t.polarity = 'negative' AND ${current} AND ($3::int IS NULL OR r.property_id = $3)
  GROUP BY t.topic
  ORDER BY count(*) DESC
  LIMIT 1
`;

const totalSql = `
  SELECT ${statsColumns}, (${topComplaintSql}) AS "topComplaint"
  FROM reviews r
  WHERE $3::int IS NULL OR r.property_id = $3
`;

const propertiesSql = `
  SELECT p.id, p.name, ${statsColumns},
         (SELECT t.topic FROM review_topics t JOIN reviews r ON r.id = t.review_id
          WHERE t.polarity = 'negative' AND ${current} AND r.property_id = p.id
          GROUP BY t.topic ORDER BY count(*) DESC LIMIT 1) AS "topComplaint"
  FROM properties p
  LEFT JOIN reviews r ON r.property_id = p.id
  GROUP BY p.id, p.name
  ORDER BY p.id
`;

export async function getOverview(filters) {
  const [total] = await query(totalSql, [filters.from, filters.previousFrom, filters.property]);
  const properties = await query(propertiesSql, [filters.from, filters.previousFrom]);
  return { ...total, properties };
}
