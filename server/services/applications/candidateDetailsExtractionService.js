import { extractSkills } from "../job/skillExtractionService.js";

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
      const { ai } = await import("../aiService.js");
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
        max_tokens: 800,
        temperature: 0.0,
      });

      const content =
        resp?.choices?.[0]?.message?.content || resp?.choices?.[0]?.text || "";

      // attempt to extract JSON from content
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      const parsed = jsonMatch ? JSON.parse(jsonMatch[0]) : JSON.parse(content);

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
      // fall through to heuristic
    }
  }

  return {
    name: name || "",
    email: email || "",
    phone: phone || "",
    location: location || "",
    background,
    extractedSkills,
  };
}
