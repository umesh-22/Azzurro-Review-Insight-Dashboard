import { query } from "../database/db.js";
import { settings } from "../config/settings.js";
import { getIssues } from "../queries/issues.js";
import { askGroq } from "./groqClient.js";

const instructions = `You write short review summaries for hotel operations staff who are not technical.
The "period" field says which time the facts cover. Always describe the time exactly that way.
Use only the facts given. Do not invent numbers. Write 3 to 4 plain sentences, then one line starting with "Suggested action:".`;

const inPeriod = "($1::int IS NULL OR property_id = $1) AND ($2::date IS NULL OR review_date >= $2)";

async function collectFacts({ property, from, label }) {
  const [stats] = await query(
    `SELECT coalesce((SELECT name FROM properties WHERE id = $1), 'All hotels') AS name,
            round(avg(score), 1)::float AS average, count(*)::int AS reviews
     FROM reviews WHERE ${inPeriod}`,
    [property, from]
  );
  const comments = await query(
    `SELECT coalesce(translated_disliked, disliked_text) AS text FROM reviews
     WHERE ${inPeriod} AND length(disliked_text) > 20
     ORDER BY review_date DESC LIMIT 15`,
    [property, from]
  );
  const issues = await getIssues({ property, from, to: null });

  return {
    period: label,
    ...stats,
    complaints: issues.topics.filter((t) => t.negative > 0).slice(0, 3).map((t) => t.topic),
    praise: [...issues.topics].sort((a, b) => b.positive - a.positive).filter((t) => t.positive > 0).slice(0, 3).map((t) => t.topic),
    comments: comments.map((c) => c.text)
  };
}

function templateSummary(facts) {
  const complaints = facts.complaints.join(", ") || "none";
  const praise = facts.praise.join(", ") || "none";
  return `${facts.name}: ${facts.reviews} reviews ${facts.period} with an average rating of ${facts.average ?? "n/a"}/10. Main complaints: ${complaints}. Most praised: ${praise}.`;
}

async function writeSummary(facts) {
  try {
    const text = await askGroq({ model: settings.groqModel, instructions, message: JSON.stringify(facts) });
    return { text, source: "ai" };
  } catch (error) {
    console.log(`AI summary unavailable, using template (${error.message})`);
    return { text: templateSummary(facts), source: "template" };
  }
}

async function createSummary(options, scope) {
  const summary = await writeSummary(await collectFacts(options));
  await query(
    `INSERT INTO daily_summaries (scope, created_on, text, source) VALUES ($1, current_date, $2, $3)
     ON CONFLICT (scope, created_on) DO UPDATE SET text = $2, source = $3`,
    [scope, summary.text, summary.source]
  );
  return summary;
}

export async function getSummary(options) {
  const scope = `${options.property || "all"}:${options.from || "all-time"}`;
  const saved = await query(
    "SELECT text, source FROM daily_summaries WHERE scope = $1 AND created_on = current_date AND NOT $2",
    [scope, options.refresh]
  );
  return saved[0] || createSummary(options, scope);
}
