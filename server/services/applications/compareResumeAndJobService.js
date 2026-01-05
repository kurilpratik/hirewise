import { ai } from "../aiService.js";

/**
 * Compare a job and an application (resume + candidate details) using the AI service.
 * Returns an object:
 * {
 *   matchedSkills: string[],
 *   missingSkills: string[],
 *   topReasonsToHire: string[] // max 3
 *   score: number|null // 0-100 (provided by AI) or null if unavailable
 * }
 *
 * application: { candidate: { name, email, phone, location, background, extractedSkills, resumeText, resumePath }, jobId, ... }
 * job: { title, company, description, requiredSkills, location, experience, ... }
 */
export async function compareResumeAndJob(application = {}, job = {}) {
  const resumeText = String(
    application?.candidate?.resumeText || application?.resumeText || "",
  ).trim();

  const candidate = application?.candidate || {};
  const jobTitle = job?.title || "";
  const jobCompany = job?.company || "";
  const jobDescription = String(job?.description || "").trim();
  const jobSkills = Array.isArray(job?.requiredSkills)
    ? job.requiredSkills
    : [];

  // Keep resume text reasonably sized for prompt
  const MAX_RESUME_CHARS = 30_000;
  const resumeForPrompt =
    resumeText.length > MAX_RESUME_CHARS
      ? resumeText.slice(0, MAX_RESUME_CHARS) + "\n\n...[truncated]"
      : resumeText;

  const systemPrompt =
    "You are a hiring assistant. Respond ONLY with valid JSON containing the keys: matchedSkills (array of short strings), missingSkills (array of short strings), topReasonsToHire (array of short strings, max 3), score (number 0-100). Do not include any explanations, markdown, or extra keys.";

  const userPrompt = [
    {
      role: "user",
      content: `Compare the following JOB posting and CANDIDATE resume and extracted candidate details.

JOB:
Title: ${jobTitle}
Company: ${jobCompany}
Required skills (if provided): ${jobSkills.length ? jobSkills.join(", ") : "N/A"}
Description:
${jobDescription}

CANDIDATE:
Name: ${candidate.name || "N/A"}
Email: ${candidate.email || "N/A"}
Location: ${candidate.location || "N/A"}
Background / summary: ${candidate.background || "N/A"}
Explicitly extracted skills (if any): ${
        Array.isArray(candidate.extractedSkills) &&
        candidate.extractedSkills.length
          ? candidate.extractedSkills.join(", ")
          : "N/A"
      }

Resume text (may be long) below:
${resumeForPrompt}

Instructions:
- Identify which skills from the job posting are clearly demonstrated in the resume -> matchedSkills.
- Identify which important skills from the job posting are NOT present in the resume -> missingSkills.
- You may also include other relevant skills that appear in the resume but are not in the job posting in matchedSkills.
- Provide up to 3 concise topReasonsToHire (each 6-20 words) focusing on concrete signals from the resume (projects, years experience, tools, outcomes).
- Provide a numeric score (0-100) representing the candidate fit for the job in the 'score' key.
- Output ONLY a valid JSON object with the four keys listed above.`,
    },
  ];

  // Choose model from env or sensible default
  const model =
    process.env.OPENROUTER_MODEL || process.env.OPENAI_MODEL || "gpt-4o-mini";

  try {
    const resp = await ai.chat.completions.create({
      model,
      messages: [{ role: "system", content: systemPrompt }, ...userPrompt],
      temperature: 0.0,
      max_tokens: 800,
    });

    const content =
      resp?.choices?.[0]?.message?.content ||
      resp?.choices?.[0]?.message ||
      resp?.choices?.[0]?.text ||
      "";

    // Try to extract JSON substring if the model wrapped with text
    let jsonText = content;
    const jsonFenceMatch = content.match(/```(?:json)?\n([\s\S]*?)```/);
    if (jsonFenceMatch) {
      jsonText = jsonFenceMatch[1];
    } else {
      // Try to find first "{" ... "}" block
      const firstBrace = content.indexOf("{");
      const lastBrace = content.lastIndexOf("}");
      if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
        jsonText = content.slice(firstBrace, lastBrace + 1);
      }
    }

    let parsed = {};
    try {
      parsed = JSON.parse(jsonText);
    } catch (err) {
      // If parsing failed, keep parsed as empty object to allow graceful handling below
      parsed = parsed || {};
    }

    // Normalize outputs
    const normalizeArray = (v) => {
      if (!v) return [];
      if (Array.isArray(v))
        return v.map((s) => String(s).trim()).filter(Boolean);
      // if string comma-separated
      if (typeof v === "string") {
        return v
          .split(/\n|,|;/)
          .map((s) => s.trim())
          .filter(Boolean);
      }
      return [];
    };

    const matched = normalizeArray(parsed.matchedSkills).slice(0, 100);
    const missing = normalizeArray(parsed.missingSkills).slice(0, 100);
    const reasons = normalizeArray(parsed.topReasonsToHire).slice(0, 3);

    // Take score from AI output (do not compute locally). If absent or invalid, set null.
    const parseScore = (s) => {
      const n = Number(s);
      if (!Number.isFinite(n)) return null;
      if (n < 0) return 0;
      if (n > 100) return 100;
      return Math.round(n);
    };

    const score = parseScore(parsed.score);

    const result = {
      matchedSkills: matched,
      missingSkills: missing,
      topReasonsToHire: reasons,
      score,
      raw: String(content).slice(0, 10000), // keep short raw for debugging if needed
    };

    return result;
  } catch (err) {
    console.error("compareResumeAndJob error:", err?.message || err);
    // graceful fallback: do not compute a score locally; indicate score unavailable
    const fallbackMatched = Array.isArray(candidate.extractedSkills)
      ? candidate.extractedSkills.slice(0, 100)
      : [];
    const fallbackMissing = Array.isArray(jobSkills)
      ? jobSkills.slice(0, 100)
      : [];

    return {
      matchedSkills: fallbackMatched,
      missingSkills: fallbackMissing,
      topReasonsToHire: [],
      score: null,
      error: err?.message || "AI call failed",
    };
  }
}
