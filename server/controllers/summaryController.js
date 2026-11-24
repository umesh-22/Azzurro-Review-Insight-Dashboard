import { getSummary } from "../insights/buildSummary.js";

export async function summary(req, res) {
  res.json(await getSummary({
    property: req.query.property || null,
    from: req.query.from || null,
    label: req.query.label || "all time",
    refresh: req.query.refresh === "true"
  }));
}
