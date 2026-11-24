import { useEffect } from "react";
import { postJson } from "../api.js";
import { useApi } from "../utils/useApi.js";
import { timeAgo } from "../utils/format.js";

function latestUpdate(properties) {
  return properties.map((p) => p.lastUpdated).filter(Boolean).sort().at(-1);
}

function lastResult(properties) {
  const failed = properties.some((p) => p.status === "failed" || p.status === "needs_attention");
  const newReviews = properties.reduce((sum, p) => sum + (p.newReviews || 0), 0);
  if (failed) return { text: "❌ Last fetch had a problem. See Data status.", color: "text-rose-600" };
  return { text: `✅ Last fetch added ${newReviews} new reviews`, color: "text-emerald-700" };
}

export default function RefreshBox() {
  const status = useApi("status");
  const running = status.data?.running;

  useEffect(() => {
    if (!running) return;
    const timer = setInterval(status.reload, 5000);
    return () => clearInterval(timer);
  }, [running]);

  async function fetchNewReviews() {
    await postJson("refresh");
    status.reload();
  }

  const result = status.data && lastResult(status.data.properties);

  return (
    <div className="rounded-xl bg-slate-50 border border-slate-200 p-3 text-sm">
      <p className="text-slate-500">Reviews last updated</p>
      <p className="font-semibold text-slate-800">{status.data && timeAgo(latestUpdate(status.data.properties))}</p>

      <button onClick={fetchNewReviews} disabled={running} className="mt-3 w-full rounded-lg bg-white border border-brand text-brand font-semibold py-2 hover:bg-brand-soft disabled:opacity-50">
        {running && "Fetching…"}{!running && "Fetch new reviews"}
      </button>

      {running && <p className="mt-2 text-xs text-amber-700">⏳ A browser window opens on the server computer. This can take a few minutes.</p>}
      {!running && result && <p className={`mt-2 text-xs ${result.color}`}>{result.text}</p>}
    </div>
  );
}
