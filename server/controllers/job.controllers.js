import Job from "../models/job.model.js";
import { generateJobDescription } from "../services/generateJDService.js";
import { generateAndSaveSkillsJob } from "../services/jobSkillGenerationService.js";

export const generateJD = async (req, res) => {
  try {
    const { title, company, location, experience } = req.body;
    const text = await generateJobDescription({
      title,
      company,
      location,
      experience,
    });
    return res.status(200).json({ description: text });
  } catch (err) {
    console.error("generate-jd error:", err);
    return res
      .status(500)
      .json({ message: err.message || "Failed to generate job description" });
  }
};

export const createJob = async (req, res) => {
  try {
    const {
      title,
      company,
      description,
      location,
      experience,
      requiredSkills,
      status,
    } = req.body;

    // Basic required fields check
    if (!title || !company || !description) {
      return res
        .status(400)
        .json({ message: "title, company and description are required" });
    }

    // Validate requiredSkills if provided
    if (requiredSkills !== undefined && !Array.isArray(requiredSkills)) {
      return res
        .status(400)
        .json({ message: "requiredSkills must be an array of strings" });
    }

    const jobData = { title, company, description, location, experience };

    if (requiredSkills) jobData.requiredSkills = requiredSkills;
    if (status) jobData.status = status;

    const job = await Job.create(jobData);

    // Return immediately to the client
    res.status(201).json({ message: "Job created", job });

    // Fire-and-forget skill generation in same process (non-blocking)
    // Use setImmediate to avoid blocking the response cycle and catch rejections.
    setImmediate(() => {
      generateAndSaveSkillsJob(job._id, {
        title,
        company,
        description,
        location,
        experience,
      }).catch((err) => {
        console.error("Background skill generation error (unhandled):", err);
      });
    });

    return;
  } catch (err) {
    if (err.name === "ValidationError") {
      const errors = Object.values(err.errors).map((e) => e.message);
      return res.status(400).json({ message: "Validation failed", errors });
    }
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};

export const getJob = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ message: "Job id is required" });
    }

    const job = await Job.findById(id).lean();
    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    return res.status(200).json({ job });
  } catch (err) {
    if (err.name === "CastError") {
      return res.status(400).json({ message: "Invalid job id" });
    }
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};

export const getJobs = async (req, res) => {
  try {
    // Query params
    const { page: pageQ, limit: limitQ, homepage, status, q } = req.query;

    // If homepage query param is present and truthy, force limit to 5
    const isHomepage = String(homepage || "").toLowerCase() === "true";

    const defaultLimit = isHomepage ? 5 : 10;

    const page = Math.max(1, parseInt(pageQ, 10) || 1);
    const limit = Math.max(1, parseInt(limitQ, 10) || defaultLimit);

    // Build filter - allow filtering by status and a simple text search (title/company)
    const filter = {};
    if (status) filter.status = status;
    if (q) {
      // Perform a simple OR text search on title and company
      const regex = new RegExp(q, "i");
      filter.$or = [{ title: regex }, { company: regex }];
    }

    const total = await Job.countDocuments(filter);

    const totalPages = limit > 0 ? Math.ceil(total / limit) : 0;

    // If requested page is beyond totalPages, return empty array but valid meta
    const skip = (page - 1) * limit;

    const jobs = await Job.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    return res.status(200).json({
      jobs,
      meta: {
        page,
        limit,
        total,
        totalPages,
      },
    });
  } catch (err) {
    console.error("get-jobs error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};
