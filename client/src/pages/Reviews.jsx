import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useApi } from "../utils/useApi.js";
import { exportUrl } from "../api.js";
import { periodStart, topicNames, formatDate } from "../utils/format.js";
import Panel from "../components/Panel.jsx";
import ReviewCard from "../components/ReviewCard.jsx";

const selectStyle = "mt-1 block rounded-lg border border-slate-300 bg-white px-3 py-2";

export default function Reviews({ filters }) {
  const [params, setParams] = useSearchParams();
  const [searchText, setSearchText] = useState(params.get("search") || "");

  const query = {
    property: filters.property,
    from: params.get("from") || periodStart(filters.period),
    topic: params.get("topic"),
    sentiment: params.get("sentiment"),
    search: params.get("search"),
    language: params.get("language"),
    page: Number(params.get("page")) || 1
  };
  const reviews = useApi("reviews", query);
  const languages = useApi("languages");
  const totalPages = Math.max(1, Math.ceil((reviews.data?.total || 0) / 20));

  function update(field, value) {
    const next = new URLSearchParams(params);
    next.set(field, value);
    next.delete("page");
    [...next.entries()].filter(([, v]) => !v).forEach(([k]) => next.delete(k));
    setParams(next);
  }

  function goToPage(page) {
    const next = new URLSearchParams(params);
    next.set("page", page);
    setParams(next);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function search(event) {
    event.preventDefault();
    update("search", searchText);
  }

  return (
    <div className="space-y-6">
      <Panel>
        <div className="flex flex-wrap items-end gap-3">
          <label className="text-sm text-slate-600">
            Topic
            <select value={query.topic || ""} onChange={(e) => update("topic", e.target.value)} className={selectStyle}>
              <option value="">All topics</option>
              {topicNames.map((topic) => <option key={topic} value={topic}>{topic}</option>)}
            </select>
          </label>

          <label className="text-sm text-slate-600">
            Guest mood
            <select value={query.sentiment || ""} onChange={(e) => update("sentiment", e.target.value)} className={selectStyle}>
              <option value="">All reviews</option>
              <option value="positive">😊 Happy (8 and above)</option>
              <option value="neutral">😐 Mixed (7 to 7.9)</option>
              <option value="negative">😞 Unhappy (below 7)</option>
            </select>
          </label>

          <label className="text-sm text-slate-600">
            Language
            <select value={query.language || ""} onChange={(e) => update("language", e.target.value)} className={selectStyle}>
              <option value="">All languages</option>
              {(languages.data || []).map((language) => (
                <option key={language.name} value={language.codes}>{language.name} ({language.count})</option>
              ))}
            </select>
          </label>

          <form onSubmit={search} className="text-sm text-slate-600 flex-1 min-w-60">
            Search words
            <div className="mt-1 flex gap-2">
              <input value={searchText} onChange={(e) => setSearchText(e.target.value)} placeholder="e.g. breakfast, towels, parking" className="flex-1 rounded-lg border border-slate-300 px-3 py-2" />
              <button className="rounded-lg bg-brand px-4 text-white font-semibold">Search</button>
            </div>
          </form>

          <a href={exportUrl(query)} className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50">
            ⬇ Download as Excel (CSV)
          </a>
        </div>
      </Panel>

      <Panel loading={reviews.loading} error={reviews.error}>
        <div className="flex flex-wrap items-center gap-3 text-slate-600">
          <p>Showing <strong>{reviews.data?.total}</strong> reviews, newest first.</p>
          {params.get("from") && (
            <span className="rounded-full bg-brand-soft px-3 py-1 text-sm text-brand">
              Since {formatDate(params.get("from"))}
              <button onClick={() => update("from", "")} className="ml-2 font-semibold underline">Clear</button>
            </span>
          )}
        </div>
      </Panel>

      <div className="space-y-4">
        {reviews.data?.reviews.map((review) => <ReviewCard key={review.id} review={review} />)}
      </div>

      {reviews.data && (
        <div className="flex items-center justify-center gap-4">
          <button disabled={query.page <= 1} onClick={() => goToPage(query.page - 1)} className="rounded-lg border border-slate-300 bg-white px-4 py-2 disabled:opacity-40">← Newer</button>
          <span className="text-slate-600">Page {query.page} of {totalPages}</span>
          <button disabled={query.page >= totalPages} onClick={() => goToPage(query.page + 1)} className="rounded-lg border border-slate-300 bg-white px-4 py-2 disabled:opacity-40">Older →</button>
        </div>
      )}
    </div>
  );
}
