const htmlCodes = { "&#39;": "'", "&quot;": '"', "&amp;": "&", "&lt;": "<", "&gt;": ">" };

function cleanText(text) {
  return (text || "").replace(/&#39;|&quot;|&amp;|&lt;|&gt;/g, (code) => htmlCodes[code]).trim();
}

export function mapReview(card) {
  const text = card.textDetails || {};
  const booking = card.bookingDetails || {};
  const guest = card.guestDetails || {};

  return {
    reviewId: card.reviewUrl,
    score: card.reviewScore,
    title: cleanText(text.title),
    likedText: cleanText(text.positiveText),
    dislikedText: cleanText(text.negativeText),
    reviewDate: new Date(card.reviewedDate * 1000).toLocaleDateString("en-CA", { timeZone: "Australia/Sydney" }),
    stayDate: booking.checkinDate,
    nights: booking.numNights,
    roomType: booking.roomType?.name,
    travellerType: guest.guestTypeTranslation,
    country: guest.countryName,
    language: text.lang,
    hotelReply: cleanText(card.partnerReply?.reply)
  };
}

export function isValidReview(review) {
  return Boolean(review.reviewId && review.score >= 1 && review.score <= 10 && review.reviewDate);
}
