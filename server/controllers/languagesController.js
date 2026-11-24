import { getLanguages } from "../queries/languages.js";

export async function languages(req, res) {
  res.json(await getLanguages());
}
