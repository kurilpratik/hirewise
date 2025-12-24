import fs from "fs";
import path from "path";
import multer from "multer";

const UPLOAD_DIR = path.resolve(process.cwd(), "server", "uploads", "resumes");
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

const ALLOWED_MIMES = ["application/pdf", "text/plain"];
const ALLOWED_EXTS = [".pdf", ".txt"];

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, UPLOAD_DIR);
  },
  filename(req, file, cb) {
    const safeName = `${Date.now()}-${file.originalname}`;
    cb(null, safeName);
  },
});

function fileFilter(req, file, cb) {
  const ext = path.extname(file.originalname).toLowerCase();
  if (ALLOWED_MIMES.includes(file.mimetype) || ALLOWED_EXTS.includes(ext)) {
    cb(null, true);
  } else {
    cb(
      new multer.MulterError(
        "LIMIT_UNEXPECTED_FILE",
        "Only PDF or TXT files are allowed",
      ),
    );
  }
}

// Single file upload only (field name: 'file'), max 5 MB
export const uploadSingle = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 },
}).single("file");

// Multer error handler
export function multerErrorHandler(err, req, res, next) {
  if (err instanceof multer.MulterError) {
    let message = err.message || "File upload error";
    switch (err.code) {
      case "LIMIT_FILE_SIZE":
        message = "File is too large (max 5 MB)";
        break;
      case "LIMIT_UNEXPECTED_FILE":
        message = "Invalid file type or unexpected file field";
        break;
      default:
        break;
    }
    return res.status(400).json({ error: message, code: err.code });
  }
  return next(err);
}

/*
Usage example (in your route file):

import express from 'express';
import { uploadSingle, multerErrorHandler } from '../middleware/upload.midd.js';

const router = express.Router();

router.post('/api/upload', uploadSingle, async (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

  // req.file.path -> path on disk. You can read it, upload to S3, save metadata to DB, etc.
  // Example: const fileBuffer = fs.readFileSync(req.file.path)

  // TODO: Upload to S3 or process file

  return res.json({ success: true, file: { originalname: req.file.originalname, filename: req.file.filename, size: req.file.size } });
});

// Add this error handler after your routes to catch multer errors
// app.use(multerErrorHandler);
*/
