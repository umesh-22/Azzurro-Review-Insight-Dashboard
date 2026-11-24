import { ResponsiveContainer, LineChart, Line, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, CartesianGrid } from "recharts";
import { formatDate } from "../utils/format.js";

function weekLabel(week) {
  return formatDate(week).replace(/ \d{4}$/, "");
}

export function RatingChart({ weeks }) {
  return (
    <ResponsiveContainer width="100%" height={260}>
      <LineChart data={weeks}>
        <CartesianGrid stroke="#f1f5f9" />
        <XAxis dataKey="week" tickFormatter={weekLabel} fontSize={12} />
        <YAxis domain={[0, 10]} fontSize={12} />
        <Tooltip labelFormatter={(week) => `Week of ${formatDate(week)}`} formatter={(value) => [`${value} / 10`, "Average rating"]} />
        <Line type="monotone" dataKey="average" stroke="#13224b" strokeWidth={3} dot={{ r: 3 }} />
      </LineChart>
    </ResponsiveContainer>
  );
}

export function MoodChart({ weeks }) {
  return (
    <ResponsiveContainer width="100%" height={260}>
      <BarChart data={weeks}>
        <CartesianGrid stroke="#f1f5f9" />
        <XAxis dataKey="week" tickFormatter={weekLabel} fontSize={12} />
        <YAxis allowDecimals={false} fontSize={12} />
        <Tooltip labelFormatter={(week) => `Week of ${formatDate(week)}`} />
        <Legend />
        <Bar dataKey="positive" name="Happy guests (8+)" fill="#10b981" radius={[4, 4, 0, 0]} />
        <Bar dataKey="negative" name="Unhappy guests (below 7)" fill="#f43f5e" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
