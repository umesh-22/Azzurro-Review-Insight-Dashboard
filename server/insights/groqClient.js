import { settings } from "../config/settings.js";

const groqUrl = "https://api.groq.com/openai/v1/chat/completions";

export async function askGroq({ model, instructions, message, json = false }) {
  const response = await fetch(groqUrl, {
    method: "POST",
    headers: { Authorization: `Bearer ${settings.groqApiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      model,
      temperature: 0.2,
      response_format: (json && { type: "json_object" }) || undefined,
      messages: [
        { role: "system", content: instructions },
        { role: "user", content: message }
      ]
    })
  });

  if (!response.ok) throw new Error(`Groq request failed with status ${response.status}`);

  const data = await response.json();
  return data.choices[0].message.content.trim();
}
