import { useApi } from "../utils/useApi.js";
import { timeAgo } from "../utils/format.js";
import Panel from "../components/Panel.jsx";

const statusText = {
  success: { text: "✅ Up to date", color: "text-emerald-700" },
  running: { text: "⏳ Fetching now", color: "text-amber-700" },
  needs_attention: { text: "⚠️ No reviews found. Booking.com may have changed its page", color: "text-amber-700" },
  failed: { text: "❌ Could not fetch. It will try again at the next update", color: "text-rose-700" }
};

const notRunYet = { text: "Not fetched yet", color: "text-slate-500" };

export default function DataStatus() {
  const status = useApi("status");

  return (
    <div className="space-y-6">
      <Panel title="🔄 Review collection" hint="Reviews are collected from Booking.com when someone presses “Fetch new reviews” in the menu." loading={status.loading} error={status.error}>
        <table className="w-full text-left">
          <thead className="text-sm text-slate-500 border-b border-slate-200">
            <tr>
              <th className="py-2 pr-4">Hotel</th>
              <th className="py-2 pr-4">Reviews collected</th>
              <th className="py-2 pr-4">Last new review saved</th>
              <th className="py-2 pr-4">Last check</th>
              <th className="py-2">Result</th>
            </tr>
          </thead>
          <tbody>
            {status.data?.properties.map((hotel) => {
              const result = statusText[hotel.status] || notRunYet;
              return (
                <tr key={hotel.id} className="border-b border-slate-100">
                  <td className="py-3 pr-4 font-medium text-slate-800">{hotel.property}</td>
                  <td className="py-3 pr-4">{hotel.totalReviews.toLocaleString()}</td>
                  <td className="py-3 pr-4">{timeAgo(hotel.lastUpdated)}</td>
                  <td className="py-3 pr-4">{timeAgo(hotel.lastRun)}</td>
                  <td className={`py-3 text-sm ${result.color}`}>{result.text}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </Panel>

      <Panel title="ℹ️ Good to know">
        <ul className="list-disc pl-5 text-sm text-slate-600 space-y-1">
          <li>Only new reviews are added. The same review is never saved twice.</li>
          <li>Collecting reviews opens a browser window on the computer running this app. Please leave it open until it finishes.</li>
          <li>If Booking.com shows a "check you are human" puzzle, solve it in that window and collection will continue.</li>
        </ul>
      </Panel>
    </div>
  );
}
