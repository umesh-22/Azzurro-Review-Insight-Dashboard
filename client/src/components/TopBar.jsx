import { useApi } from "../utils/useApi.js";
import { periods } from "../utils/format.js";

export default function TopBar({ title, hint, filters, setFilters, showFilters }) {
  const hotels = useApi("properties");

  function update(field, value) {
    setFilters({ ...filters, [field]: value });
  }

  return (
    <header className="flex flex-wrap items-end justify-between gap-4 mb-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">{title}</h1>
        <p className="text-slate-500">{hint}</p>
      </div>

      {showFilters && <div className="flex flex-wrap gap-3">
        <label className="text-sm text-slate-600">
          Hotel
          <select value={filters.property} onChange={(e) => update("property", e.target.value)} className="mt-1 block w-56 rounded-lg border border-slate-300 bg-white px-3 py-2">
            <option value="">All hotels</option>
            {(hotels.data || []).map((hotel) => (
              <option key={hotel.id} value={hotel.id}>{hotel.name}</option>
            ))}
          </select>
        </label>

        <label className="text-sm text-slate-600">
          Time period
          <select value={filters.period} onChange={(e) => update("period", e.target.value)} className="mt-1 block w-44 rounded-lg border border-slate-300 bg-white px-3 py-2">
            {periods.map((period) => (
              <option key={period.value} value={period.value}>{period.label}</option>
            ))}
          </select>
        </label>
      </div>}
    </header>
  );
}
