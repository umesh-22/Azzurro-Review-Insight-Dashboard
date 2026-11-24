import { translateReview } from "../insights/translateReview.js";

export async function translate(req, res) {
  res.json(await translateReview(req.params.id));
}
