import { query } from "../database/db.js";
import { languageName } from "../config/languages.js";
import { filterSql, sentimentSql } from "./filters.js";

const pageSize = 20;

const reviewsSql = `
  SELECT r.id, p.name AS property, r.review_date AS date, r.score::float AS score, ${sentimentSql} AS sentiment,
         r.title, r.liked_text AS liked, r.disliked_text AS disliked, r.language, r.room_type AS "roomType",
         r.traveller_type AS "travellerType", r.country, r.nights, r.hotel_reply AS "hotelReply",
         coalesce((SELECT json_agg(json_build_object('topic', t.topic, 'polarity', t.polarity))
                   FROM review_topics t WHERE t.review_id = r.id), '[]') AS topics,
         count(*) OVER()::int AS total
  FROM reviews r
  JOIN properties p ON p.id = r.property_id
  WHERE ${filterSql}
    AND ($4::text IS NULL OR EXISTS (SELECT 1 FROM review_topics t WHERE t.review_id = r.id AND t.topic = $4))
    AND ($5::text IS NULL OR ${sentimentSql} = $5)
    AND ($6::text IS NULL OR concat_ws(' ', r.title, r.liked_text, r.disliked_text, r.translated_title,
                                       r.translated_liked, r.translated_disliked) ILIKE '%' || $6 || '%')
    AND ($9::text[] IS NULL OR coalesce(r.language, 'und') = ANY($9))
  ORDER BY r.review_date DESC, r.id DESC
  LIMIT $7 OFFSET $8
`;

function reviewParams(filters, limit, offset) {
  return [filters.property, filters.from, filters.to, filters.topic, filters.sentiment, filters.search, limit, offset, filters.languages];
}

function addLanguage(review) {
  const name = languageName(review.language);
  return { ...review, languageName: name, isEnglish: name === "English" };
}

export async function getReviews(filters) {
  const rows = await query(reviewsSql, reviewParams(filters, pageSize, (filters.page - 1) * pageSize));
  const total = rows[0]?.total || 0;
  return { total, page: filters.page, pageSize, reviews: rows.map(({ total, ...review }) => addLanguage(review)) };
}

export async function getAllReviews(filters) {
  const rows = await query(reviewsSql, reviewParams(filters, null, 0));
  return rows.map(({ total, topics, language, ...review }) => ({
    ...review,
    language: languageName(language),
    topics: topics.map((t) => `${t.topic} (${t.polarity})`).join("; ")
  }));
}
