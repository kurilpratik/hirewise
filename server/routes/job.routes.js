import express from "express";
import {
  createJob,
  getJob,
  generateJD,
  getJobs,
} from "../controllers/job.controllers.js";
import { generateAndSaveSkillsJob } from "../services/jobSkillGenerationService.js";

const router = express.Router();

router.post("/create", createJob);
router.post("/generate-jd", generateJD);
router.get("/", getJobs);
// dynamic id route must come last to avoid catching other named routes
router.get("/:id", getJob);

//router.post("/:id/generate-skills", generateAndSaveSkillsJob);
//We are calling it this way because the generateAndSaveSkillsJob is not an express handler but a service function which expects jobId and context as parameters so we wrap it in an async function here to avoid errors.
router.post("/:id/generate-skills", async (req, res) => {
  try {
    const { id } = req.params;
    const result = await generateAndSaveSkillsJob(id, req.body);
    return res.status(200).json(result);
  } catch (err) {
    console.error("generate-skills error:", err);
    return res
      .status(500)
      .json({ message: err.message || "Skill generation failed" });
  }
});

export default router;
