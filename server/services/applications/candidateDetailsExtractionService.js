import { extractSkills } from "../job/skillExtractionService.js";

function normalizeAiResponseText(value) {
  if (typeof value === "string") return value;
  if (Array.isArray(value)) {
    return value
      .map((item) => normalizeAiResponseText(item))
      .filter(Boolean)
      .join("\n");
  }

  if (value && typeof value === "object") {
    if (typeof value.content === "string") return value.content;
    if (typeof value.text === "string") return value.text;
    if (typeof value.message === "string") return value.message;
    if (value.message && typeof value.message === "object") {
      return normalizeAiResponseText(value.message);
    }
    if (Array.isArray(value.content)) {
      return normalizeAiResponseText(value.content);
    }
  }

  return "";
}

function parseJsonFromAiResponse(content = "") {
  const text = String(content || "").trim();
  if (!text) return null;

  const candidates = [];
  if (text.startsWith("{") && text.endsWith("}")) {
    candidates.push(text);
  }

  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (jsonMatch) candidates.push(jsonMatch[0]);

  for (const candidate of candidates) {
    try {
      const parsed = JSON.parse(candidate);
      if (parsed && typeof parsed === "object") return parsed;
    } catch {
      // Try the next candidate if the current one is malformed.
    }
  }

  return null;
}

/**
 * Extracts candidate details from a resume text.
 * Returns an object matching the candidate subdocument in application.model:
 * { name, email, phone, location, background, extractedSkills }
 */
export async function extractCandidateDetails(resumeText = "", opts = {}) {
  const text = String(resumeText || "").trim();
  if (!text) {
    return {
      name: "",
      email: "",
      phone: "",
      location: "",
      background: "",
      extractedSkills: [],
    };
  }

  // Attempt AI extraction when available (OpenRouter compatible aiService.js)
  if (process.env.OPENROUTER_API_KEY) {
    try {
      const { ai, JSON_COMPLETION_PARAMS } = await import("../aiService.js");
      const prompt = `Extract candidate details from the resume below. Collect candidate details and skills - the skills are from what the candidate has mentioned in their resume and what they have showcased in their projects and experience. Return valid JSON only with keys:
- name (string)
- email (string)
- phone (string)
- location (string)
- background (string)
- skills (array of strings)

Resume:
---
${text}
---
Return JSON only.`;
      const model =
        process.env.OPENROUTER_MODEL ||
        "meta-llama/llama-3.3-70b-instruct:free";
      const resp = await ai.chat.completions.create({
        model,
        messages: [{ role: "user", content: prompt }],
        temperature: 0.0,
        ...JSON_COMPLETION_PARAMS,
      });

      const content = normalizeAiResponseText(
        resp?.choices?.[0]?.message ?? resp?.choices?.[0] ?? "",
      );

      const parsed = parseJsonFromAiResponse(content);
      if (!parsed) {
        throw new Error("No valid JSON object found in AI response");
      }

      const skills =
        Array.isArray(parsed.skills) && parsed.skills.length
          ? parsed.skills.map((s) => String(s).trim()).filter(Boolean)
          : [];

      return {
        name: parsed.name ? String(parsed.name).trim() : "",
        email: parsed.email ? String(parsed.email).trim().toLowerCase() : "",
        phone: parsed.phone ? String(parsed.phone).trim() : "",
        location: parsed.location ? String(parsed.location).trim() : "",
        background: parsed.background ? String(parsed.background).trim() : "",
        extractedSkills: skills,
      };
    } catch (err) {
      console.warn(
        "AI candidate extraction failed, falling back to heuristic:",
        err?.message || err,
      );
    }
  }

  const heuristicSkills = await extractSkills(text, { min: 4, max: 12 });

  return {
    name: "",
    email: "",
    phone: "",
    location: "",
    background: "",
    extractedSkills: heuristicSkills,
  };
}
