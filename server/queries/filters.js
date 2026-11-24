import { scoreRules } from "../config/topics.js";

export const sentimentSql = `CASE WHEN r.score >= ${scoreRules.positiveFrom} THEN 'positive'
  WHEN r.score < ${scoreRules.negativeBelow} THEN 'negative' ELSE 'neutral' END`;

export const filterSql = `($1::int IS NULL OR r.property_id = $1)
  AND ($2::date IS NULL OR r.review_date >= $2)
  AND ($3::date IS NULL OR r.review_date <= $3)`;

export function readFilters(req) {
  return {
    property: req.query.property || null,
    from: req.query.from || null,
    previousFrom: req.query.previousFrom || null,
    to: req.query.to || null,
    topic: req.query.topic || null,
    sentiment: req.query.sentiment || null,
    search: req.query.search || null,
    languages: (req.query.language && req.query.language.split(",")) || null,
    page: Number(req.query.page) || 1
  };
}

export function filterParams(filters) {
  return [filters.property, filters.from, filters.to];
}
