import { query } from "../database/db.js";
import { scoreRules } from "../config/topics.js";
import { filterSql, filterParams } from "./filters.js";

const issuesSql = `
  WITH filtered AS (
    SELECT r.id, r.score FROM reviews r WHERE ${filterSql}
  ),
  negative_reviews AS (
    SELECT count(*) AS total FROM filtered WHERE score < ${scoreRules.negativeBelow}
  )
  SELECT t.topic,
         count(*) FILTER (WHERE t.polarity = 'negative')::int AS negative,
         count(*) FILTER (WHERE t.polarity = 'positive')::int AS positive,
         coalesce(round(100.0 * count(*) FILTER (WHERE t.polarity = 'negative' AND f.score < ${scoreRules.negativeBelow})
           / NULLIF((SELECT total FROM negative_reviews), 0)), 0)::int AS "negativeReviewPercent"
  FROM review_topics t
  JOIN filtered f ON f.id = t.review_id
  GROUP BY t.topic
  ORDER BY negative DESC
`;

function buildInsights(topics) {
  const complaints = [...topics]
    .sort((a, b) => b.negativeReviewPercent - a.negativeReviewPercent)
    .filter((item) => item.negativeReviewPercent > 0)
    .slice(0, 3)
    .map((item) => `${item.negativeReviewPercent}% of negative reviews mentioned ${item.topic.toLowerCase()} issues.`);

  const praise = [...topics]
    .sort((a, b) => b.positive - a.positive)
    .filter((item) => item.positive > 0)
    .slice(0, 1)
    .map((item) => `${item.topic} is the most praised topic (${item.positive} positive mentions).`);

  return [...complaints, ...praise];
}

export async function getIssues(filters) {
  const topics = await query(issuesSql, filterParams(filters));
  return { topics, insights: buildInsights(topics) };
}
