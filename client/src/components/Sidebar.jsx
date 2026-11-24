import { NavLink } from "react-router-dom";
import RefreshBox from "./RefreshBox.jsx";

const links = [
  { to: "/", icon: "📊", title: "Overview", hint: "How are we doing?" },
  { to: "/issues", icon: "🛠️", title: "Issues", hint: "What needs fixing?" },
  { to: "/reviews", icon: "💬", title: "Reviews", hint: "What guests said" },
  { to: "/status", icon: "🔄", title: "Data status", hint: "Is the data up to date?" }
];

const linkStyles = {
  true: "bg-brand text-white shadow",
  false: "text-slate-700 hover:bg-brand-soft"
};

export default function Sidebar() {
  return (
    <aside className="fixed inset-y-0 left-0 z-10 w-64 h-screen overflow-y-auto bg-white border-r border-slate-200 flex flex-col">
      <div className="p-5 border-b border-slate-100">
        <p className="text-3xl font-extrabold tracking-tight text-brand">
          Azzurro<span className="text-accent">.</span>
        </p>
        <p className="text-xs text-slate-500 mt-1">Guest reviews dashboard</p>
      </div>

      <nav className="p-3 flex flex-col gap-1">
        {links.map((link) => (
          <NavLink key={link.to} to={link.to} end className={({ isActive }) => `flex items-center gap-3 rounded-xl px-3 py-3 transition ${linkStyles[isActive]}`}>
            <span className="text-xl">{link.icon}</span>
            <span>
              <span className="block font-semibold">{link.title}</span>
              <span className="block text-xs opacity-80">{link.hint}</span>
            </span>
          </NavLink>
        ))}
      </nav>

      <div className="mt-auto p-3">
        <RefreshBox />
      </div>
    </aside>
  );
}
