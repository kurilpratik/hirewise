/**
 * Extracts 6-10 skills from provided text.
 * - Uses OpenRouter SDK (aiService.js) when OPENROUTER_API_KEY is set.
 * - Otherwise falls back to a heuristic extraction using a small tech whitelist + tokenization.
 */
const DEFAULT_MIN = 6;
const DEFAULT_MAX = 10;

const KNOWN_SKILLS = [
  "JavaScript",
  "TypeScript",
  "React",
  "Vue",
  "Angular",
  "Node.js",
  "Express.js",
  "MongoDB",
  "PostgreSQL",
  "MySQL",
  "HTML",
  "CSS",
  "Sass",
  "Tailwind",
  "Redux",
  "Next.js",
  "Gatsby",
  "GraphQL",
  "REST",
  "Docker",
  "Kubernetes",
  "AWS",
  "Azure",
  "Python",
  "Django",
  "Flask",
  "Java",
  "Spring",
  "C#",
  ".NET",
  "Go",
  "PHP",
  "Laravel",
];

export async function extractSkills(text = "", opts = {}) {
  const min = opts.min || DEFAULT_MIN;
  const max = opts.max || DEFAULT_MAX;
  const input = String(text || "").trim();

  if (!input) return [];

  // If OpenRouter key present, attempt a small prompt via the SDK
  if (process.env.OPENROUTER_API_KEY) {
    try {
      const { ai } = await import("./aiService.js");
      const prompt = `Extract ${min}-${max} distinct most-relevant skills/technologies from the following job text. Return final answer as a comma-separated list only.\n\n---\n${input}\n\nList:`;
      const model =
        process.env.OPENROUTER_MODEL ||
        "meta-llama/llama-3.3-70b-instruct:free";
      const resp = await ai.chat.completions.create({
        model,
        messages: [{ role: "user", content: prompt }],
        max_tokens: 200,
        temperature: 0.0,
      });

      const textOut =
        (resp?.choices && resp.choices[0]?.message?.content) ||
        resp?.choices?.[0]?.text ||
        "";

      const list = textOut
        .split(/,|\n|;/)
        .map((s) => s.trim())
        .filter(Boolean)
        .slice(0, max);

      if (list.length >= Math.min(3, min)) {
        console.log("Skill extraction (OpenRouter) success:", list.join(", "));
        return Array.from(new Set(list));
      } else {
        console.warn(
          `Skill extraction (OpenRouter) returned too few items (${list.length}), falling back to heuristic.`,
        );
      }
    } catch (err) {
      console.error(
        "OpenRouter skill extraction failed, falling back to heuristic:",
        err?.message || err,
      );
    }
  }

  // Heuristic fallback: match known skills and popular tokens
  const tokens = input
    .replace(/[^\w+.#-]/g, " ")
    .split(/\s+/)
    .map((t) => t.trim())
    .filter(Boolean)
    .map((t) => t.replace(/^\.|,$/g, ""));

  const found = new Set();

  // 1) match known skills
  const lowerInput = input.toLowerCase();
  for (const s of KNOWN_SKILLS) {
    if (lowerInput.includes(s.toLowerCase())) found.add(s);
    if (found.size >= max) break;
  }

  // 2) add capitalized tokens or tokens containing '.' (node.js) or '-' (react-native)
  if (found.size < max) {
    for (const t of tokens) {
      if (found.size >= max) break;
      if (t.length > 2 && (/[A-Z]/.test(t[0]) || /[.#-]/.test(t))) {
        found.add(t);
      }
    }
  }

  // 3) frequency-based fill
  if (found.size < min) {
    const freq = {};
    for (const t of tokens) freq[t] = (freq[t] || 0) + 1;
    const sorted = Object.keys(freq).sort((a, b) => freq[b] - freq[a]);
    for (const t of sorted) {
      if (found.size >= min) break;
      if (t.length > 2) found.add(t);
    }
  }

  console.log(
    `Skill extraction fallback (heuristic) produced ${found.size} items:`,
    Array.from(found).slice(0, max).join(", "),
  );

  return Array.from(found).slice(0, max);
}
