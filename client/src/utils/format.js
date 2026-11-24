export const periods = [
  { value: "week", label: "This week", current: "this week", previous: "last week" },
  { value: "7", label: "Last 7 days", current: "in the last 7 days", previous: "the 7 days before" },
  { value: "30", label: "Last 30 days", current: "in the last 30 days", previous: "the 30 days before" },
  { value: "90", label: "Last 3 months", current: "in the last 3 months", previous: "the 3 months before" },
  { value: "365", label: "Last 12 months", current: "in the last 12 months", previous: "the 12 months before" },
  { value: "all", label: "All time", current: "all time", previous: "" }
];

export const topicNames = ["Cleanliness", "Check-in", "Staff", "Noise", "Facilities", "Location", "Room condition", "Value for money"];

export function periodInfo(period) {
  return periods.find((item) => item.value === period) || periods[0];
}

function daysAgo(days) {
  return new Date(Date.now() - days * 86400000).toLocaleDateString("en-CA", { timeZone: "Australia/Sydney" });
}

function daysSinceMonday() {
  const sydneyNow = new Date(new Date().toLocaleString("en-US", { timeZone: "Australia/Sydney" }));
  return (sydneyNow.getDay() + 6) % 7;
}

const fixedRanges = {
  week: () => ({ from: daysAgo(daysSinceMonday()), previousFrom: daysAgo(daysSinceMonday() + 7) }),
  all: () => ({ from: null, previousFrom: null })
};

export function periodRange(period) {
  const days = Number(period);
  const range = fixedRanges[period] || (() => ({ from: daysAgo(days), previousFrom: daysAgo(days * 2) }));
  return range();
}

export function periodStart(period) {
  return periodRange(period).from;
}

export function formatScore(score) {
  return score?.toFixed(1) ?? "–";
}

export function formatDate(date) {
  return new Date(date).toLocaleDateString("en-AU", { day: "numeric", month: "short", year: "numeric" });
}

export function timeAgo(date) {
  const minutes = Math.round((Date.now() - new Date(date)) / 60000);
  const units = [
    { limit: 60, text: `${minutes} min ago` },
    { limit: 1440, text: `${Math.round(minutes / 60)} hours ago` },
    { limit: Infinity, text: `${Math.round(minutes / 1440)} days ago` }
  ];
  return (date && units.find((unit) => minutes < unit.limit).text) || "never";
}

const changeStyles = {
  1: { arrow: "▲", word: "better", color: "text-emerald-600" },
  0: { arrow: "●", word: "same", color: "text-slate-500" },
  "-1": { arrow: "▼", word: "worse", color: "text-rose-600" }
};

export function changeInfo(change, previousLabel) {
  const style = changeStyles[Math.sign(change ?? 0)];
  if (change === null || change === undefined) return { ...style, text: "Nothing to compare with" };
  return { ...style, text: `${style.arrow} ${Math.abs(change).toFixed(1)} ${style.word} than ${previousLabel}` };
}

export const sentimentStyles = {
  positive: { label: "Happy guest", color: "bg-emerald-100 text-emerald-800" },
  neutral: { label: "Mixed", color: "bg-amber-100 text-amber-800" },
  negative: { label: "Unhappy guest", color: "bg-rose-100 text-rose-800" }
};
