export default function Panel({ title, hint, loading, error, children, className = "" }) {
  return (
    <section className={`rounded-2xl bg-white border border-slate-200 p-5 shadow-sm ${className}`}>
      {title && <h2 className="font-semibold text-slate-800">{title}</h2>}
      {hint && <p className="text-sm text-slate-500 mb-4">{hint}</p>}
      {loading && <p className="text-slate-400 py-6 text-center">Loading…</p>}
      {error && <p className="text-rose-600 py-6 text-center">{error}</p>}
      {!loading && !error && children}
    </section>
  );
}
