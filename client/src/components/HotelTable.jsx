import { formatScore, changeInfo } from "../utils/format.js";

export default function HotelTable({ hotels, period, onSelect }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left">
        <thead className="text-sm text-slate-500 border-b border-slate-200">
          <tr>
            <th className="py-2 pr-4">Hotel</th>
            <th className="py-2 pr-4">Rating</th>
            <th className="py-2 pr-4">Before</th>
            <th className="py-2 pr-4">Change</th>
            <th className="py-2 pr-4">Reviews</th>
            <th className="py-2">Main complaint</th>
          </tr>
        </thead>
        <tbody>
          {hotels.map((hotel) => {
            const change = changeInfo(hotel.change, period.previous);
            return (
              <tr key={hotel.id} onClick={() => onSelect(String(hotel.id))} className="border-b border-slate-100 hover:bg-brand-soft cursor-pointer">
                <td className="py-3 pr-4 font-medium text-slate-800">{hotel.name}</td>
                <td className="py-3 pr-4 font-semibold">{formatScore(hotel.current)}</td>
                <td className="py-3 pr-4 text-slate-500">{formatScore(hotel.previous)}</td>
                <td className={`py-3 pr-4 text-sm ${change.color}`}>{change.arrow} {formatScore(hotel.change && Math.abs(hotel.change))}</td>
                <td className="py-3 pr-4">{hotel.reviews.toLocaleString()}</td>
                <td className="py-3 text-rose-700">{hotel.topComplaint || "–"}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <p className="mt-3 text-xs text-slate-400">Tip: click a hotel to see only that hotel.</p>
    </div>
  );
}
