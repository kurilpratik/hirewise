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
router.post("/:id/generate-skills", generateAndSaveSkillsJob);

export default router;
