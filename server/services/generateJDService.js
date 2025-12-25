import { ai } from "./aiService.js";

/**
 * Generate a job description for HR use.
 * @param {Object} params
 * @param {string} params.title - Job title (required)
 * @param {string} params.company - Company name (required)
 * @param {string} [params.location] - Location (onsite/remote/hybrid or city)
 * @param {string|number} [params.experience] - Years of experience or description
 * @returns {Promise<string>} Generated job description text
 */
export async function generateJobDescription({
  title,
  company,
  location,
  experience,
} = {}) {
  if (!title || !company) {
    throw new TypeError("title and company are required");
  }

  // Build a clear prompt for the model
  const userParts = [`Job Title: ${title}`, `Company: ${company}`];
  if (location) userParts.push(`Location: ${location}`);
  if (experience) userParts.push(`Experience: ${experience}`);

  const systemMessage = {
    role: "system",
    content:
      "You are an expert HR copywriter. Produce a clear, professional job description targeted to HR and hiring teams. Include a short summary, responsibilities (bullet list), required qualifications (bullet list), preferred qualifications (if any), and a short section on benefits and how to apply. Keep it concise and suitable for posting or internal use.",
  };

  const userMessage = {
    role: "user",
    content:
      "Create a job description using the following details:\n\n" +
      userParts.join("\n"),
  };

  // Choose model from env if provided; otherwise allow API default
  const model = process.env.OPENROUTER_MODEL;

  try {
    // call the chat completion endpoint on the ai client
    const resp = await ai.chat.completions.create({
      model,
      messages: [systemMessage, userMessage],
      temperature: 0.2,
      max_tokens: 800,
    });

    // Extract text robustly
    let text;
    if (
      resp?.choices &&
      resp.choices.length &&
      resp.choices[0].message?.content
    ) {
      text = resp.choices[0].message.content;
    } else if (
      resp?.choices &&
      resp.choices.length &&
      typeof resp.choices[0].text === "string"
    ) {
      text = resp.choices[0].text;
    } else if (typeof resp === "string") {
      text = resp;
    } else {
      text = JSON.stringify(resp);
    }

    return text.trim();
  } catch (err) {
    err.message = `generateJobDescription error: ${err.message}`;
    throw err;
  }
}
