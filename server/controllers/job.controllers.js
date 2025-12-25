import Job from "../models/job.model.js";

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

    const jobData = { title, company, description };

    if (location) jobData.location = location;
    if (experience) jobData.experience = experience;
    if (requiredSkills) jobData.requiredSkills = requiredSkills;
    if (status) jobData.status = status;

    const job = await Job.create(jobData);

    return res.status(201).json({ message: "Job created", job });
  } catch (err) {
    if (err.name === "ValidationError") {
      const errors = Object.values(err.errors).map((e) => e.message);
      return res.status(400).json({ message: "Validation failed", errors });
    }
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};
