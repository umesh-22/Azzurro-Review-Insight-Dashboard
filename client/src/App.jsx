import { useState } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import Sidebar from "./components/Sidebar.jsx";
import TopBar from "./components/TopBar.jsx";
import Overview from "./pages/Overview.jsx";
import Issues from "./pages/Issues.jsx";
import Reviews from "./pages/Reviews.jsx";
import DataStatus from "./pages/DataStatus.jsx";

const pageTitles = {
  "/": { title: "Overview", hint: "How our hotels are rated for the time period you choose." },
  "/issues": { title: "Issues", hint: "What guests complain about and what they love." },
  "/reviews": { title: "Reviews", hint: "Read what guests wrote, newest first." },
  "/status": { title: "Data status", hint: "Check that reviews are being collected.", hideFilters: true }
};

export default function App() {
  const [filters, setFilters] = useState({ property: "", period: "week" });
  const page = pageTitles[useLocation().pathname] || pageTitles["/"];

  return (
    <div className="min-h-screen bg-slate-50">
      <Sidebar />
      <main className="ml-64 p-6 lg:p-8 max-w-7xl">
        <TopBar title={page.title} hint={page.hint} filters={filters} setFilters={setFilters} showFilters={!page.hideFilters} />
        <Routes>
          <Route path="/" element={<Overview filters={filters} setFilters={setFilters} />} />
          <Route path="/issues" element={<Issues filters={filters} />} />
          <Route path="/reviews" element={<Reviews filters={filters} />} />
          <Route path="/status" element={<DataStatus />} />
        </Routes>
      </main>
    </div>
  );
}
