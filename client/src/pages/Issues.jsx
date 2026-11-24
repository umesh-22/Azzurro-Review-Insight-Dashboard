import { useNavigate } from "react-router-dom";
import { useApi } from "../utils/useApi.js";
import { periodStart } from "../utils/format.js";
import Panel from "../components/Panel.jsx";
import TopicChart from "../components/TopicChart.jsx";

export default function Issues({ filters }) {
  const issues = useApi("issues", { property: filters.property, from: periodStart(filters.period) });
  const navigate = useNavigate();

  function openTopic(topic) {
    navigate(`/reviews?topic=${encodeURIComponent(topic)}`);
  }

  return (
    <div className="space-y-6">
      <Panel title="💡 Key findings" hint="What guests talk about most in the selected period." loading={issues.loading} error={issues.error}>
        <ul className="space-y-2">
          {issues.data?.insights.map((insight) => (
            <li key={insight} className="rounded-xl bg-slate-50 p-3 text-slate-700">{insight}</li>
          ))}
        </ul>
        {issues.data?.insights.length === 0 && <p className="text-slate-500">No reviews in this period yet.</p>}
      </Panel>

      <Panel title="📋 Complaints and praise by topic" hint="Red = guests complained about it. Green = guests liked it. Click a bar to read those reviews." loading={issues.loading} error={issues.error}>
        {issues.data && <TopicChart topics={issues.data.topics} onSelect={openTopic} />}
      </Panel>

      <Panel title="ℹ️ How topics are found">
        <p className="text-sm text-slate-600 leading-relaxed">
          Each review has a "liked" and a "didn't like" part. We look for common words in each part (for example "dirty", "smell" or "stain" for
          Cleanliness). Words found in the "didn't like" part count as a complaint, and words in the "liked" part count as praise. A "negative review"
          is one rated below 7 out of 10. This is a simple word match, so it can miss unusual wording or reviews in other languages.
        </p>
      </Panel>
    </div>
  );
}
