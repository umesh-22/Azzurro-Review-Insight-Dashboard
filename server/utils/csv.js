function toCell(value) {
  const text = String(value ?? "").replaceAll('"', '""');
  return `"${text}"`;
}

export function toCsv(rows) {
  const headers = Object.keys(rows[0] || {});
  const lines = rows.map((row) => headers.map((header) => toCell(row[header])).join(","));
  return [headers.join(","), ...lines].join("\n");
}
