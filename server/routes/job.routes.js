import express from "express";
import {
  createJob,
  getJob,
  generateJD,
} from "../controllers/job.controllers.js";

const router = express.Router();

router.post("/create", createJob);
router.get("/:id", getJob);
router.post("/generate-jd", generateJD);

export default router;
