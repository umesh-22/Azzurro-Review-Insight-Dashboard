import "dotenv/config";

export const settings = {
  port: process.env.PORT || 4000,
  databaseUrl: process.env.DATABASE_URL,
  databaseSsl: (!/localhost|127\.0\.0\.1/.test(process.env.DATABASE_URL) && { rejectUnauthorized: false }) || false,
  groqApiKey: process.env.GROQ_API_KEY,
  groqModel: process.env.GROQ_MODEL || "openai/gpt-oss-120b",
  groqTranslateModel: process.env.GROQ_TRANSLATE_MODEL || "openai/gpt-oss-20b"
};
