import { Queue } from "bullmq";
import Application from "../models/application.model.js";
import Job from "../models/job.model.js";
import { processAndCreateApplication } from "../services/applications/processAndCreateApplicationService.js";
import { extractCandidateDetails } from "../services/applications/candidateDetailsExtractionService.js";
import { compareResumeAndJob } from "../services/applications/compareResumeAndJobService.js";

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

    // Build base application data (we will add AI comparison results before creating)
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
      // default scoring fields (will be overwritten with AI results)
      score: 0,
      matchedSkills: [],
      missingSkills: [],
      topReasonsToHire: [],
      analysis: {},
    };

    // Fetch job and run AI comparison BEFORE creating the application
    let comparisonResult = {};
    try {
      const job = await Job.findById(jobId);
      const jobObj = job ? job.toObject() : {};

      // Create a minimal application object for the comparator
      const tempAppForComparison = {
        jobId,
        candidate: appData.candidate,
      };

      comparisonResult = await compareResumeAndJob(
        tempAppForComparison,
        jobObj,
      );
    } catch (err) {
      console.warn("compareResumeAndJob failed:", err?.message || err);
    }

    const matchedSkills = Array.isArray(comparisonResult.matchedSkills)
      ? comparisonResult.matchedSkills
      : [];
    const missingSkills = Array.isArray(comparisonResult.missingSkills)
      ? comparisonResult.missingSkills
      : [];
    const topReasonsToHire = Array.isArray(comparisonResult.topReasonsToHire)
      ? comparisonResult.topReasonsToHire
      : [];

    // Prefer score returned by compareResumeAndJob when available, otherwise fall back
    // to the matched/(matched+missing) heuristic.
    const score = (() => {
      if (
        comparisonResult &&
        typeof comparisonResult.score === "number" &&
        !Number.isNaN(comparisonResult.score)
      ) {
        // ensure score is in 0-100 and integer
        const s = Math.round(comparisonResult.score);
        return Math.max(0, Math.min(100, s));
      }
      const denom = matchedSkills.length + missingSkills.length;
      if (denom === 0) return 0;
      return Math.round((matchedSkills.length / denom) * 100);
    })();

    // Attach AI results into appData before creating the document
    appData.matchedSkills = matchedSkills;
    appData.missingSkills = missingSkills;
    appData.topReasonsToHire = topReasonsToHire;
    appData.score = score;
    appData.analysis = {
      ...(appData.analysis || {}),
      aiComparison: {
        raw: comparisonResult.raw || null,
        error: comparisonResult.error || null,
        // preserve score returned by the comparator (if any)
        comparatorScore:
          typeof comparisonResult.score === "number"
            ? comparisonResult.score
            : null,
      },
    };

    // Save to MongoDB (now includes AI comparison)
    const createdApplication = await Application.create(appData);
    console.log("Created application:", createdApplication._id);

    // Add application reference to the Job document (avoid duplicates)
    try {
      await Job.findByIdAndUpdate(jobId, {
        $addToSet: { applications: createdApplication._id },
      });
    } catch (err) {
      console.warn("Failed to add application to job:", err?.message || err);
    }

    // Enqueue for further processing (e.g. vector store / heavy processing)
    await applicationQueue.add("file-ready", {
      applicationId: createdApplication._id,
      jobId,
      file: req.file,
    });

    const updatedApplication = await Application.findById(
      createdApplication._id,
    );

    return res.status(201).json({
      message: "Application created",
      application: updatedApplication,
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

export const getApplicationById = async (req, res) => {
  try {
    const { id } = req.params;
    const application = await Application.findById(id);
    if (!application) {
      return res.status(404).json({ error: "Application not found" });
    }
    return res.status(200).json({ application });
  } catch (error) {
    console.error("getApplicationById error:", error);
    return res.status(500).json({ error: "Server error" });
  }
};
