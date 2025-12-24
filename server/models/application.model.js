import mongoose from "mongoose";
import validator from "validator";

const applicationSchema = new mongoose.Schema(
  {
    jobId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Job",
      required: [true, "Job reference is required"],
      index: true,
    },
    // Embedded Candidate Information
    candidate: {
      name: {
        type: String,
        required: [true, "Candidate name is required"],
        trim: true,
        minlength: [2, "Name must be at least 2 characters"],
        maxlength: [100, "Name cannot exceed 100 characters"],
      },
      email: {
        type: String,
        required: [true, "Email is required"],
        lowercase: true,
        trim: true,
        validate: {
          validator: function (email) {
            return validator.isEmail(email);
          },
          message: "Please provide a valid email address",
        },
      },
      phone: {
        type: String,
        trim: true,
        validate: {
          validator: function (phone) {
            if (!phone) return true;
            return /^[\+]?[(]?[0-9]{1,4}[)]?[-\s\.]?[(]?[0-9]{1,4}[)]?[-\s\.]?[0-9]{1,9}$/.test(
              phone,
            );
          },
          message: "Please provide a valid phone number",
        },
      },
      location: {
        type: String,
        trim: true,
        maxlength: [150, "Location cannot exceed 150 characters"],
      },
      background: {
        type: String,
        trim: true,
        maxlength: [2000, "Background cannot exceed 2000 characters"],
      },
      resumePath: {
        type: String,
        trim: true,
        validate: {
          validator: function (path) {
            if (!path) return true;
            return path.length > 0 && path.length < 500;
          },
          message: "Invalid resume path",
        },
      },
      resumeText: {
        type: String,
        trim: true,
        maxlength: [50000, "Resume text cannot exceed 50000 characters"],
      },
      extractedSkills: {
        type: [String],
        default: [],
        validate: {
          validator: function (skills) {
            return skills.every(
              (skill) => skill.trim().length > 0 && skill.length < 100,
            );
          },
          message: "Each skill must be non-empty and under 100 characters",
        },
      },
    },
    // AI Matching Results
    score: {
      type: Number,
      min: [0, "Score cannot be less than 0"],
      max: [100, "Score cannot be greater than 100"],
      default: 0,
      validate: {
        validator: function (value) {
          return value >= 0 && value <= 100;
        },
        message: "Score must be between 0 and 100",
      },
    },
    rank: {
      type: Number,
      min: [1, "Rank must be at least 1"],
      default: null,
    },
    matchedSkills: {
      type: [String],
      default: [],
      validate: {
        validator: function (skills) {
          return skills.every(
            (skill) => skill.trim().length > 0 && skill.length < 100,
          );
        },
        message:
          "Each matched skill must be non-empty and under 100 characters",
      },
    },
    missingSkills: {
      type: [String],
      default: [],
      validate: {
        validator: function (skills) {
          return skills.every(
            (skill) => skill.trim().length > 0 && skill.length < 100,
          );
        },
        message:
          "Each missing skill must be non-empty and under 100 characters",
      },
    },
    topReasonsToHire: {
      type: [String],
      default: [],
      validate: {
        validator: function (reasons) {
          return (
            reasons.length <= 10 &&
            reasons.every(
              (reason) => reason.trim().length > 0 && reason.length < 500,
            )
          );
        },
        message:
          "Maximum 10 reasons, each must be non-empty and under 500 characters",
      },
    },
    analysis: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
      validate: {
        validator: function (value) {
          return value && typeof value === "object" && !Array.isArray(value);
        },
        message: "Analysis must be an object",
      },
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

// Compound indexes for performance
applicationSchema.index({ jobId: 1, "candidate.email": 1 }, { unique: true }); // Prevent duplicate applications
applicationSchema.index({ jobId: 1, score: -1 }); // Get top candidates for a job

// Pre-save middleware to clean and normalize data
applicationSchema.pre("save", function (next) {
  // Clean up candidate extractedSkills
  if (
    this.candidate.extractedSkills &&
    this.candidate.extractedSkills.length > 0
  ) {
    this.candidate.extractedSkills = this.candidate.extractedSkills
      .map((skill) => skill.trim())
      .filter((skill) => skill.length > 0)
      .filter(
        (skill, index, self) =>
          index ===
          self.findIndex((s) => s.toLowerCase() === skill.toLowerCase()),
      );
  }

  // Clean up matchedSkills array
  if (this.matchedSkills && this.matchedSkills.length > 0) {
    this.matchedSkills = this.matchedSkills
      .map((skill) => skill.trim())
      .filter((skill) => skill.length > 0)
      .filter(
        (skill, index, self) =>
          index ===
          self.findIndex((s) => s.toLowerCase() === skill.toLowerCase()),
      );
  }

  // Clean up missingSkills array
  if (this.missingSkills && this.missingSkills.length > 0) {
    this.missingSkills = this.missingSkills
      .map((skill) => skill.trim())
      .filter((skill) => skill.length > 0)
      .filter(
        (skill, index, self) =>
          index ===
          self.findIndex((s) => s.toLowerCase() === skill.toLowerCase()),
      );
  }

  // Clean up topReasonsToHire array
  if (this.topReasonsToHire && this.topReasonsToHire.length > 0) {
    this.topReasonsToHire = this.topReasonsToHire
      .map((reason) => reason.trim())
      .filter((reason) => reason.length > 0)
      .slice(0, 10);
  }

  // Normalize phone number
  if (this.candidate.phone) {
    this.candidate.phone = this.candidate.phone.trim().replace(/\s+/g, " ");
  }

  next();
});

// Virtuals - Application
applicationSchema.virtual("scoreGrade").get(function () {
  if (this.score >= 90) return "Top Candidate";
  if (this.score >= 75) return "Good";
  if (this.score >= 60) return "Fair";
  if (this.score >= 50) return "Poor";
  return "Very Poor";
});

applicationSchema.virtual("isTopCandidate").get(function () {
  return this.rank && this.rank <= 3;
});

applicationSchema.virtual("candidate.initials").get(function () {
  return this.candidate.name
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase())
    .join("");
});

// Instance methods - Application
applicationSchema.methods.updateScore = function (newScore) {
  if (newScore < 0 || newScore > 100) {
    throw new Error("Score must be between 0 and 100");
  }
  this.score = newScore;
  return this.save();
};

applicationSchema.methods.updateRank = function (newRank) {
  if (newRank < 1) {
    throw new Error("Rank must be at least 1");
  }
  this.rank = newRank;
  return this.save();
};

applicationSchema.methods.updateAnalysis = function (analysisData) {
  this.analysis = { ...this.analysis, ...analysisData };
  return this.save();
};

applicationSchema.methods.addReason = function (reason) {
  if (!reason || reason.trim().length === 0) {
    throw new Error("Reason cannot be empty");
  }
  if (this.topReasonsToHire.length >= 10) {
    throw new Error("Maximum 10 reasons allowed");
  }
  this.topReasonsToHire.push(reason.trim());
  return this.save();
};

// Instance methods - Candidate
applicationSchema.methods.addSkillsToCandidate = function (newSkills) {
  const skillsToAdd = Array.isArray(newSkills) ? newSkills : [newSkills];

  skillsToAdd.forEach((skill) => {
    const trimmedSkill = skill.trim();
    if (
      trimmedSkill &&
      !this.candidate.extractedSkills.some(
        (s) => s.toLowerCase() === trimmedSkill.toLowerCase(),
      )
    ) {
      this.candidate.extractedSkills.push(trimmedSkill);
    }
  });

  return this.save();
};

// Static methods - Application queries
applicationSchema.statics.findByJob = function (jobId, options = {}) {
  const query = this.find({ jobId });

  if (options.minScore) {
    query.where("score").gte(options.minScore);
  }

  if (options.location) {
    query.where("candidate.location").regex(new RegExp(options.location, "i"));
  }

  if (options.populateJob) {
    query.populate("jobId", "title company location requiredSkills status");
  }

  return query.sort({ score: -1, createdAt: -1 });
};

applicationSchema.statics.getTopCandidatesForJob = function (
  jobId,
  limit = 10,
) {
  return this.find({ jobId }).sort({ score: -1, createdAt: -1 }).limit(limit);
};

// Static methods - Statistics and utilities
applicationSchema.statics.getApplicationStats = async function (jobId) {
  const stats = await this.aggregate([
    { $match: { jobId: mongoose.Types.ObjectId(jobId) } },
    {
      $group: {
        _id: null,
        totalApplications: { $sum: 1 },
        averageScore: { $avg: "$score" },
        maxScore: { $max: "$score" },
        minScore: { $min: "$score" },
        strongMatches: {
          $sum: { $cond: [{ $gte: ["$score", 75] }, 1, 0] },
        },
        goodMatches: {
          $sum: {
            $cond: [
              { $and: [{ $gte: ["$score", 60] }, { $lt: ["$score", 75] }] },
              1,
              0,
            ],
          },
        },
        fairMatches: {
          $sum: {
            $cond: [
              { $and: [{ $gte: ["$score", 50] }, { $lt: ["$score", 60] }] },
              1,
              0,
            ],
          },
        },
        poorMatches: {
          $sum: { $cond: [{ $lt: ["$score", 50] }, 1, 0] },
        },
      },
    },
  ]);

  return (
    stats[0] || {
      totalApplications: 0,
      averageScore: 0,
      maxScore: 0,
      minScore: 0,
      strongMatches: 0,
      goodMatches: 0,
      fairMatches: 0,
      poorMatches: 0,
    }
  );
};

applicationSchema.statics.updateRankingsForJob = async function (jobId) {
  const applications = await this.find({ jobId }).sort({
    score: -1,
    createdAt: -1,
  });

  const updatePromises = applications.map((app, index) => {
    app.rank = index + 1;
    return app.save();
  });

  return Promise.all(updatePromises);
};

const Application = mongoose.model("Application", applicationSchema);

export default Application;
