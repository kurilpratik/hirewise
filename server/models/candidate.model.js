// DEPRECIATED - NOT NEEDED ANYMORE

// import mongoose from "mongoose";
// import validator from "validator";

// const candidateSchema = new mongoose.Schema(
//   {
//     name: {
//       type: String,
//       required: [true, "Candidate name is required"],
//       trim: true,
//       minlength: [2, "Name must be at least 2 characters"],
//       maxlength: [100, "Name cannot exceed 100 characters"],
//     },
//     email: {
//       type: String,
//       required: [true, "Email is required"],
//       unique: true,
//       lowercase: true,
//       trim: true,
//       validate: {
//         validator: function (email) {
//           return validator.isEmail(email);
//         },
//         message: "Please provide a valid email address",
//       },
//     },
//     phone: {
//       type: String,
//       trim: true,
//       validate: {
//         validator: function (phone) {
//           // Allow empty or valid phone formats
//           if (!phone) return true;
//           // Basic phone validation (10-15 digits, optional +, spaces, dashes)
//           return /^[\+]?[(]?[0-9]{1,4}[)]?[-\s\.]?[(]?[0-9]{1,4}[)]?[-\s\.]?[0-9]{1,9}$/.test(
//             phone,
//           );
//         },
//         message: "Please provide a valid phone number",
//       },
//     },
//     location: {
//       type: String,
//       trim: true,
//       maxlength: [150, "Location cannot exceed 150 characters"],
//     },
//     background: {
//       type: String,
//       trim: true,
//       maxlength: [2000, "Background cannot exceed 2000 characters"],
//     },
//     resumePath: {
//       type: String,
//       trim: true,
//       validate: {
//         validator: function (path) {
//           // Allow empty or valid file paths
//           if (!path) return true;
//           // Basic path validation
//           return path.length > 0 && path.length < 500;
//         },
//         message: "Invalid resume path",
//       },
//     },
//     resumeText: {
//       type: String,
//       trim: true,
//       maxlength: [50000, "Resume text cannot exceed 50000 characters"],
//     },
//     extractedSkills: {
//       type: [String],
//       default: [],
//       validate: {
//         validator: function (skills) {
//           return skills.every(
//             (skill) => skill.trim().length > 0 && skill.length < 100,
//           );
//         },
//         message: "Each skill must be non-empty and under 100 characters",
//       },
//     },
//   },
//   {
//     timestamps: true,
//     toJSON: { virtuals: true },
//     toObject: { virtuals: true },
//   },
// );

// candidateSchema.pre("save", function (next) {
//   // Clean up extractedSkills array
//   if (this.extractedSkills && this.extractedSkills.length > 0) {
//     this.extractedSkills = this.extractedSkills
//       .map((skill) => skill.trim())
//       .filter((skill) => skill.length > 0)
//       // Remove duplicates (case-insensitive)
//       .filter(
//         (skill, index, self) =>
//           index ===
//           self.findIndex((s) => s.toLowerCase() === skill.toLowerCase()),
//       );
//   }

//   // Normalize phone number (remove extra spaces)
//   if (this.phone) {
//     this.phone = this.phone.trim().replace(/\s+/g, " ");
//   }

//   next();
// });

// const Candidate = mongoose.model("Candidate", candidateSchema);

// export default Candidate;
