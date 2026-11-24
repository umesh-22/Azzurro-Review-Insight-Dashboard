import { useState } from "react";
import { getJson } from "../api.js";
import { useApi } from "../utils/useApi.js";
import { periodStart, periodInfo } from "../utils/format.js";
import Panel from "./Panel.jsx";

export default function SummaryCard({ property, period }) {
  const params = { property, from: periodStart(period), label: periodInfo(period).current };
  const summary = useApi("summary", params);
  const [fresh, setFresh] = useState(null);
  const [busy, setBusy] = useState(false);

  async function regenerate() {
    setBusy(true);
    setFresh(await getJson("summary", { ...params, refresh: "true" }).catch(() => null));
    setBusy(false);
  }

  const shown = fresh || summary.data;

  return (
    <Panel title="📝 Summary in plain words" hint={`What guests said ${params.label}.`} loading={summary.loading} error={summary.error}>
      <p className="whitespace-pre-line text-slate-700 leading-relaxed">{shown?.text}</p>
      <div className="mt-4 flex items-center justify-between text-xs text-slate-400">
        <span>{shown?.source === "ai" && "Written by AI from the review numbers"}{shown?.source === "template" && "Automatic summary"}</span>
        <button onClick={regenerate} disabled={busy} className="rounded-lg border border-slate-300 px-3 py-1 text-slate-600 hover:bg-slate-50 disabled:opacity-50">
          {busy && "Writing…"}{!busy && "Write a new summary"}
        </button>
      </div>
    </Panel>
  );
}
