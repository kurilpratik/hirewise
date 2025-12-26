import mongoose from "mongoose";

const jobSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Job title is required"],
      trim: true,
      maxlength: [200, "Job title cannot exceed 200 characters"],
    },
    company: {
      type: String,
      required: [true, "Company name is required"],
      trim: true,
      maxlength: [100, "Company name cannot exceed 100 characters"],
    },

    description: {
      type: String,
      required: [true, "Job description is required"],
      trim: true,
      maxlength: [5000, "Description cannot exceed 5000 characters"],
    },
    location: {
      type: String,
      trim: true,
      maxlength: [150, "Location cannot exceed 150 characters"],
    },
    experience: {
      type: String,
      trim: true,
      maxlength: [100, "Experience field cannot exceed 100 characters"],
    },
    requiredSkills: {
      type: [String],
      default: [],
      validate: {
        validator: function (skills) {
          return skills.every((skill) => skill.trim().length > 0);
        },
        message: "Skills cannot contain empty strings",
      },
    },
    // Skill generation fields
    topSkill: {
      type: String,
      default: null,
      trim: true,
      maxlength: [100, "Top skill cannot exceed 100 characters"],
    },
    skillsGenerated: {
      type: Boolean,
      default: false,
    },
    skillGenerationStatus: {
      type: String,
      enum: ["pending", "processing", "done", "failed"],
      default: "pending",
    },
    skillGenerationError: {
      type: String,
      default: null,
    },
    status: {
      type: String,
      enum: {
        values: ["active", "closed", "draft"],
        message: "{VALUE} is not a valid status",
      },
      default: "draft",
    },

    // Added applications reference array
    applications: {
      type: [{ type: mongoose.Schema.Types.ObjectId, ref: "Application" }],
      default: [],
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

// Indexes for better query performance

// Filter by status and sort in descending order
jobSchema.index({ status: 1, createdAt: -1 });

// Filter by a particular company and status
jobSchema.index({ company: 1, status: 1 });

// Pre-save middleware to trim and clean skills
jobSchema.pre("save", function (next) {
  if (this.requiredSkills && this.requiredSkills.length > 0) {
    this.requiredSkills = this.requiredSkills
      .map((skill) => skill.trim())
      .filter((skill) => skill.length > 0);
  }
  if (typeof next === "function") next();
});

// Virtual for checking if job is open
// Virtuals are caluclated on the go and not stored in the db
jobSchema.virtual("isOpen").get(function () {
  return this.status === "active";
});

// Instance method to activate job
jobSchema.methods.activate = function () {
  this.status = "active";
  return this.save();
};

// Instance method to close job
jobSchema.methods.close = function () {
  this.status = "closed";
  return this.save();
};

// Static method to find active jobs
jobSchema.statics.findActive = function () {
  return this.find({ status: "active" }).sort({ createdAt: -1 });
};

// Static method to find jobs by company
jobSchema.statics.findByCompany = function (company) {
  return this.find({ company: new RegExp(company, "i") }).sort({
    createdAt: -1,
  });
};

const Job = mongoose.model("Job", jobSchema);

export default Job;
