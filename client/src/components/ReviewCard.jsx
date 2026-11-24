import { useState } from "react";
import { postJson } from "../api.js";
import { formatDate, sentimentStyles } from "../utils/format.js";
import TranslateButton from "./TranslateButton.jsx";

const tagStyles = {
  positive: "bg-emerald-50 text-emerald-700 border-emerald-200",
  negative: "bg-rose-50 text-rose-700 border-rose-200"
};

export default function ReviewCard({ review }) {
  const [translation, setTranslation] = useState(null);
  const [showEnglish, setShowEnglish] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const mood = sentimentStyles[review.sentiment];
  const details = [review.property, formatDate(review.date), review.travellerType, review.country].filter(Boolean).join(" · ");
  const text = (showEnglish && translation) || review;
  const mode = (busy && "busy") || (!translation && "ready") || (showEnglish && "translated") || "original";

  async function translate() {
    setBusy(true);
    setError("");
    try {
      setTranslation(await postJson(`reviews/${review.id}/translate`));
      setShowEnglish(true);
    } catch {
      setError("Translation isn't available right now. Please try again.");
    }
    setBusy(false);
  }

  function handleTranslateClick() {
    if (translation) return setShowEnglish(!showEnglish);
    translate();
  }

  return (
    <article className="rounded-2xl bg-white border border-slate-200 p-5 shadow-sm">
      <div className="flex items-start gap-4">
        <div className={`shrink-0 w-14 h-14 rounded-xl grid place-items-center text-xl font-bold ${mood.color}`}>{review.score}</div>
        <div className="flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="font-semibold text-slate-800">{text.title || "No title"}</h3>
            <span className={`text-xs rounded-full px-2 py-0.5 ${mood.color}`}>{mood.label}</span>
          </div>
          <p className="text-sm text-slate-500">{details}</p>
          {review.roomType && <p className="text-xs text-slate-400">{review.roomType}</p>}
        </div>
      </div>

      {text.liked && (
        <p className="mt-4 rounded-xl bg-emerald-50 p-3 text-slate-700"><span className="font-semibold text-emerald-700">😊 Liked: </span>{text.liked}</p>
      )}
      {text.disliked && (
        <p className="mt-2 rounded-xl bg-rose-50 p-3 text-slate-700"><span className="font-semibold text-rose-700">😞 Didn't like: </span>{text.disliked}</p>
      )}

      {!review.isEnglish && (
        <TranslateButton mode={mode} language={review.languageName} error={error} onClick={handleTranslateClick} />
      )}

      {review.topics.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-2">
          {review.topics.map((tag) => (
            <span key={`${tag.topic}-${tag.polarity}`} className={`text-xs rounded-full border px-2 py-0.5 ${tagStyles[tag.polarity]}`}>{tag.topic}</span>
          ))}
        </div>
      )}

      {review.hotelReply && (
        <details className="mt-3 text-sm text-slate-600">
          <summary className="cursor-pointer text-brand">Read the hotel's reply</summary>
          <p className="mt-2 whitespace-pre-line rounded-xl bg-slate-50 p-3">{review.hotelReply}</p>
        </details>
      )}
    </article>
  );
}
