const labels = {
  ready: "🌐 Translate to English",
  busy: "Translating…",
  translated: "Show original",
  original: "🌐 Show English translation"
};

export default function TranslateButton({ mode, language, error, onClick }) {
  return (
    <div className="mt-3 flex flex-wrap items-center gap-3 text-sm">
      <button onClick={onClick} disabled={mode === "busy"} className="rounded-lg border border-brand px-3 py-1 font-semibold text-brand hover:bg-brand-soft disabled:opacity-50">
        {labels[mode]}
      </button>
      {mode === "translated" && <span className="text-slate-500">Translated from {language} by AI</span>}
      {mode === "ready" && <span className="text-slate-400">Written in {language}</span>}
      {error && <span className="text-rose-600">{error}</span>}
    </div>
  );
}
