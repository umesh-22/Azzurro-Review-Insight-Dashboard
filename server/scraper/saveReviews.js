import { query } from "../database/db.js";

const insertSql = `
  INSERT INTO reviews (review_id, property_id, score, title, liked_text, disliked_text, review_date,
                       stay_date, nights, room_type, traveller_type, country, language, hotel_reply)
  VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
  ON CONFLICT (review_id) DO NOTHING
  RETURNING id
`;

export async function saveReviews(reviews, propertyId) {
  let inserted = 0;

  for (const review of reviews) {
    const rows = await query(insertSql, [
      review.reviewId, propertyId, review.score, review.title, review.likedText, review.dislikedText,
      review.reviewDate, review.stayDate, review.nights, review.roomType, review.travellerType,
      review.country, review.language, review.hotelReply
    ]);
    inserted += rows.length;
  }

  return inserted;
}
