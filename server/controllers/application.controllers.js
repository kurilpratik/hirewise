import Application from "../models/application.model.js";
import { processAndCreateApplication } from "../services/applications/processAndCreateApplicationService.js";

export const createApplication = async (req, res) => {
  try {
    console.log("createApplication called");
    // Expect jobId in form-data
    const { jobId } = req.body;
    if (!jobId) {
      return res.status(400).json({ error: "jobId is required" });
    }

    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const applicationDoc = await processAndCreateApplication({
      file: req.file,
      jobId,
    });

    return res.status(201).json({
      message: "Application created (Demo response)",
      jobId,
      fileInfo: req.file,
    });
  } catch (error) {
    console.error("createApplication error:", error);
    return res.status(500).json({ error: "Server error" });
  }
};
