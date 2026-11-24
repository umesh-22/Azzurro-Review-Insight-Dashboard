import { query } from "../database/db.js";
import { topics } from "../config/topics.js";

const topicPatterns = Object.entries(topics).map(([topic, words]) => ({
  topic,
  pattern: new RegExp(`\\b(${words.join("|")})`, "i")
}));

export function findTopics(text) {
  return topicPatterns.filter(({ pattern }) => pattern.test(text || "")).map(({ topic }) => topic);
}

async function saveTopics(reviewId, topicNames, polarity) {
  for (const topic of topicNames) {
    await query(
      "INSERT INTO review_topics (review_id, topic, polarity) VALUES ($1, $2, $3) ON CONFLICT DO NOTHING",
      [reviewId, topic, polarity]
    );
  }
}

export async function classifyReview(review) {
  await saveTopics(review.id, findTopics(review.liked_text), "positive");
  await saveTopics(review.id, findTopics(review.disliked_text), "negative");
  await query("UPDATE reviews SET classified = true WHERE id = $1", [review.id]);
}

export async function classifyNewReviews() {
  const reviews = await query("SELECT id, liked_text, disliked_text FROM reviews WHERE classified = false");

  for (const review of reviews) {
    await classifyReview(review);
  }

  return reviews.length;
}
