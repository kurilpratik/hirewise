import { Queue } from "bullmq";
import Application from "../models/application.model.js";
import { processAndCreateApplication } from "../services/applications/processAndCreateApplicationService.js";
import { extractCandidateDetails } from "../services/applications/candidateDetailsExtractionService.js";

const applicationQueue = new Queue("application", {
  connection: {
    host: "localhost",
    port: 6379, //valkey port
  },
});

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

    // Process file (e.g. extract text/pages) - returns { docsText, resumeText, ... }
    const applicationDoc = await processAndCreateApplication({
      file: req.file,
      jobId,
    });

    //console.log("Processed application document:", applicationDoc);

    // Prefer resumeText, fallback to docsText
    const resumeText = String(
      applicationDoc.resumeText || applicationDoc.docsText || "",
    ).trim();

    // Extract candidate details (in service)
    let candidateDetails = {
      name: "",
      email: "",
      phone: "",
      location: "",
      background: "",
      extractedSkills: [],
    };
    try {
      candidateDetails = await extractCandidateDetails(resumeText);
    } catch (err) {
      console.warn("Candidate extraction failed:", err?.message || err);
    }

    // Ensure required fields satisfy model validation:
    const name =
      candidateDetails.name && candidateDetails.name.trim().length >= 2
        ? candidateDetails.name.trim()
        : "Unknown Candidate";
    const email =
      candidateDetails.email && candidateDetails.email.includes("@")
        ? candidateDetails.email.trim().toLowerCase()
        : `unknown+${Date.now()}@example.com`;

    const resumePath =
      (req.file &&
        (req.file?.s3?.url || req.file?.path || req.file?.filename)) ||
      "";

    const appData = {
      jobId,
      candidate: {
        name,
        email,
        phone: candidateDetails.phone || "",
        location: candidateDetails.location || "",
        background: candidateDetails.background || "",
        resumePath,
        resumeText,
        extractedSkills: Array.isArray(candidateDetails.extractedSkills)
          ? candidateDetails.extractedSkills
          : [],
      },
      // default scoring fields
      score: 0,
      matchedSkills: [],
      missingSkills: [],
      topReasonsToHire: [],
      analysis: {},
    };

    // Save to MongoDB
    const createdApplication = await Application.create(appData);
    console.log("Created application:", createdApplication._id);

    // Enqueue for further processing (e.g. vector store / heavy processing)
    await applicationQueue.add("file-ready", {
      applicationId: createdApplication._id,
      jobId,
      file: req.file,
    });

    return res.status(201).json({
      message: "Application created",
      application: createdApplication,
    });
  } catch (error) {
    console.error("createApplication error:", error);
    // handle duplicate application error (unique index on jobId + candidate.email)
    if (error && error.code === 11000) {
      return res
        .status(409)
        .json({ error: "Duplicate application for this job/email" });
    }
    return res.status(500).json({ error: "Server error" });
  }
};
