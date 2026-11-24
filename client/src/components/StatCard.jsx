import { Link } from "react-router-dom";

export default function StatCard({ icon, label, value, note, noteColor = "text-slate-500", link }) {
  return (
    <Link to={link} className="group rounded-2xl bg-white border border-slate-200 p-5 shadow-sm transition hover:border-brand hover:shadow-md">
      <div className="flex items-center justify-between">
        <span className="grid h-9 w-9 place-items-center rounded-xl bg-brand-soft text-lg">{icon}</span>
        <span className="text-slate-300 transition group-hover:translate-x-1 group-hover:text-brand">→</span>
      </div>
      <p className="mt-4 text-sm text-slate-500">{label}</p>
      <p className="mt-1 truncate text-2xl font-bold text-slate-800" title={String(value)}>{value}</p>
      <p className={`mt-1 text-sm ${noteColor}`}>{note}</p>
    </Link>
  );
}
