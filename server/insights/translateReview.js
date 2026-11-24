import { query } from "../database/db.js";
import { settings } from "../config/settings.js";
import { askGroq } from "./groqClient.js";

const instructions = `Translate a hotel guest review into natural, plain English.
Reply only with JSON in this shape: {"language": "<original language name in English>", "title": "", "liked": "", "disliked": ""}.
Keep the meaning and tone. Leave a field empty if it is empty in the review.`;

function savedTranslation(review) {
  return review.translated_from && {
    language: review.translated_from,
    title: review.translated_title,
    liked: review.translated_liked,
    disliked: review.translated_disliked
  };
}

async function createTranslation(review) {
  const message = JSON.stringify({ title: review.title, liked: review.liked_text, disliked: review.disliked_text });
  const reply = await askGroq({ model: settings.groqTranslateModel, instructions, message, json: true });
  const translation = JSON.parse(reply);

  await query(
    `UPDATE reviews SET translated_from = $2, translated_title = $3, translated_liked = $4, translated_disliked = $5
     WHERE id = $1`,
    [review.id, translation.language, translation.title, translation.liked, translation.disliked]
  );

  return translation;
}

export async function translateReview(id) {
  const [review] = await query("SELECT * FROM reviews WHERE id = $1", [id]);
  return savedTranslation(review) || createTranslation(review);
}
