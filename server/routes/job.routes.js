import express from "express";
import { createJob, getJob } from "../controllers/job.controllers.js";

const router = express.Router();

router.post("/create", createJob);
router.get("/:id", getJob);

export default router;
