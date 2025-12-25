import OpenAI from "openai";
import "dotenv/config";

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
if (!OPENROUTER_API_KEY) {
  throw new Error("OPENROUTER_API_KEY is not set in environment");
}

const baseURL =
  process.env.OPENROUTER_BASE_URL || "https://openrouter.ai/api/v1";

const defaultHeaders = {};
if (process.env.SITE_URL) defaultHeaders["HTTP-Referer"] = process.env.SITE_URL;
if (process.env.SITE_TITLE) defaultHeaders["X-Title"] = process.env.SITE_TITLE;

const openai = new OpenAI({
  baseURL: baseURL,
  apiKey: OPENROUTER_API_KEY,
  defaultHeaders,
});

/*
async function chatCompletion({
  messages,
  model = process.env.OPENROUTER_MODEL ||
    "meta-llama/llama-3.3-70b-instruct:free",
  temperature = 0.7,
  max_tokens,
} = {}) {
  if (!Array.isArray(messages)) {
    throw new TypeError("messages must be an array of { role, content }");
  }
  try {
    const resp = await openai.chat.completions.create({
      model,
      messages,
      temperature,
      max_tokens,
    });
    // returns the full response; caller can read resp.choices[0].message.content
    return resp;
  } catch (err) {
    // bubble up useful message
    err.message = `OpenRouter chat error: ${err.message}`;
    throw err;
  }
}
*/

export { openai as ai };
