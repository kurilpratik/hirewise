/**
 * Pick the top skill from the skills array based on relevance to the context.
 * Context should include title, company, description, location, experience.
 */
export function rankSkills(skills = [], context = {}) {
  try {
    console.log("rankSkills - start", {
      skillsCount: Array.isArray(skills) ? skills.length : 0,
      title: context.title || "",
      company: context.company || "",
    });

    if (!Array.isArray(skills) || skills.length === 0) {
      console.log("rankSkills - no skills provided, returning null");
      return null;
    }

    const text =
      `${context.title || ""} ${context.company || ""} ${context.description || ""}`.toLowerCase();

    // Prefer skills that appear in title or description
    const scored = skills.map((s) => {
      const lower = String(s).toLowerCase();
      let score = 0;
      if (text.includes(lower)) score += 10;
      // bonus for exact word boundaries in title
      if ((context.title || "").toLowerCase().includes(lower)) score += 5;
      // shorter skills slightly preferred
      score += Math.max(0, 5 - lower.length / 10);
      return { skill: s, score };
    });

    scored.sort((a, b) => b.score - a.score);
    const best = scored[0];
    console.log("rankSkills - success", {
      selected: best.skill,
      score: best.score,
    });
    return best.skill;
  } catch (err) {
    console.error("rankSkills - error", {
      message: err.message,
      stack: err.stack,
      skills,
      context,
    });
    return null;
  }
}
