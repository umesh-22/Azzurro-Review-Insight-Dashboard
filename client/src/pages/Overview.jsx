import { useApi } from "../utils/useApi.js";
import { formatScore, changeInfo, periodRange, periodStart, periodInfo } from "../utils/format.js";
import Panel from "../components/Panel.jsx";
import StatCard from "../components/StatCard.jsx";
import SummaryCard from "../components/SummaryCard.jsx";
import HotelTable from "../components/HotelTable.jsx";
import { RatingChart, MoodChart } from "../components/TrendCharts.jsx";

const chartPeriods = { week: "84" };

export default function Overview({ filters, setFilters }) {
  const period = periodInfo(filters.period);
  const overview = useApi("overview", { property: filters.property, ...periodRange(filters.period) });
  const trends = useApi("trends", { property: filters.property, from: periodStart(chartPeriods[filters.period] || filters.period) });

  const selected = overview.data?.properties.find((hotel) => String(hotel.id) === filters.property) || overview.data;
  const change = changeInfo(selected?.change, period.previous);
  const topComplaint = overview.data?.topComplaint;
  const complaintLink = (topComplaint && `/reviews?topic=${encodeURIComponent(topComplaint)}`) || "/issues";
  const previousNote = (period.previous && `${selected?.previousReviews} ${period.previous}`) || "All reviews so far";

  return (
    <div className="space-y-6">
      {selected && (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard icon="⭐" label={`Rating ${period.current}`} value={`${formatScore(selected.current)} / 10`} note={change.text} noteColor={change.color} link="/reviews" />
          <StatCard icon="💬" label={`Reviews ${period.current}`} value={selected.reviews.toLocaleString()} note={previousNote} link="/reviews" />
          <StatCard icon="😞" label="Unhappy guests" value={`${selected.negativePercent ?? 0}%`} note={`Rated below 7 ${period.current}`} link="/reviews?sentiment=negative" />
          <StatCard icon="🛠️" label="Main complaint" value={topComplaint || "–"} note={`Most mentioned ${period.current}`} noteColor="text-rose-600" link={complaintLink} />
        </div>
      )}

      {selected && selected.reviews < 5 && (
        <p className="text-sm text-amber-700">
          ⚠️ Only {selected.reviews} reviews {period.current}, so these numbers can change a lot.
        </p>
      )}

      <SummaryCard key={`${filters.property}-${filters.period}`} property={filters.property} period={filters.period} />

      <Panel title="🏨 Hotels compared" hint={`Average rating out of 10, ${period.current} compared with ${period.previous || "nothing"}.`} loading={overview.loading} error={overview.error}>
        {overview.data && <HotelTable hotels={overview.data.properties} period={period} onSelect={(id) => setFilters({ ...filters, property: id })} />}
      </Panel>

      <div className="grid gap-6 xl:grid-cols-2">
        <Panel title="⭐ Rating over time" hint="Average rating each week. Higher is better." loading={trends.loading} error={trends.error}>
          {trends.data && <RatingChart weeks={trends.data} />}
        </Panel>
        <Panel title="🙂 Happy vs unhappy guests" hint="Number of happy (green) and unhappy (red) reviews each week." loading={trends.loading} error={trends.error}>
          {trends.data && <MoodChart weeks={trends.data} />}
        </Panel>
      </div>
      {chartPeriods[filters.period] && <p className="text-xs text-slate-400">Charts show the last 12 weeks so you can see the trend.</p>}
    </div>
  );
}
