/**
 * Generate skills required from the job description and save it to the Job document.
 * Safe for in-process background call. Handles status updates on the job doc.
 */
import Job from "../models/job.model.js";
import { extractSkills } from "./skillExtractionService.js";
import { rankSkills } from "./topSkillExtractionService.js";

export async function generateAndSaveSkillsJob(jobId, context = {}) {
  // Mark processing (best-effort)
  await Job.findByIdAndUpdate(jobId, {
    skillGenerationStatus: "processing",
    skillGenerationError: null,
  }).exec();
  try {
    const text = `${context.title || ""}\n${context.company || ""}\n${context.description || ""}`;
    const skills = await extractSkills(text, { min: 6, max: 10 });

    const topSkill = rankSkills(skills, context);

    await Job.findByIdAndUpdate(
      jobId,
      {
        requiredSkills: skills,
        topSkill: topSkill || null,
        skillsGenerated: true,
        skillGenerationStatus: "done",
        skillGenerationError: null,
      },
      { new: true },
    ).exec();

    return { success: true, skills, topSkill };
  } catch (err) {
    console.error(
      "Skill generation failed for job",
      jobId,
      err?.message || err,
    );
    await Job.findByIdAndUpdate(jobId, {
      skillGenerationStatus: "failed",
      skillGenerationError: err?.message || String(err),
    }).exec();
    return { success: false, error: err };
  }
}
