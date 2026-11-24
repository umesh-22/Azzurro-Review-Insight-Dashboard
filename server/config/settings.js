import "dotenv/config";

export const settings = {
  port: process.env.PORT || 4000,
  databaseUrl: process.env.DATABASE_URL,
  groqApiKey: process.env.GROQ_API_KEY,
  groqModel: process.env.GROQ_MODEL || "openai/gpt-oss-120b",
  groqTranslateModel: process.env.GROQ_TRANSLATE_MODEL || "openai/gpt-oss-20b"
};
