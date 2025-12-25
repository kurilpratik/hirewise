import fs from "fs";
import path from "path";
import multer from "multer";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

process.env.AWS_SDK_JS_SUPPRESS_MAINTENANCE_NODE_MESSAGE = "1";

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

// SAVE TO S3

// use region variable and conditionally supply credentials
const region = process.env.AWS_REGION || "eu-north-1";
const hasAccessKeys =
  !!process.env.AWS_ACCESS_KEY_ID && !!process.env.AWS_SECRET_ACCESS_KEY;

// Configure S3 client
const s3Client = new S3Client(
  hasAccessKeys
    ? {
        region,
        credentials: {
          accessKeyId: process.env.AWS_ACCESS_KEY_ID,
          secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
        },
      }
    : { region },
);

export const saveToS3 = async (req, res, next) => {
  console.log("AWS Config:", {
    region: process.env.AWS_REGION,
    hasAccessKey: !!process.env.AWS_ACCESS_KEY_ID,
    hasSecretKey: !!process.env.AWS_SECRET_ACCESS_KEY,
    bucket: process.env.AWS_S3_BUCKET_NAME,
  });
  if (!req.file) return next();

  const bucket = process.env.AWS_S3_BUCKET_NAME;
  if (!bucket) {
    await fs.promises
      .unlink(path.join(UPLOAD_DIR, req.file.filename))
      .catch(() => {});
    return res.status(500).json({ error: "S3 bucket not configure" });
  }

  // fail fast if explicit access keys are expected but not provided
  if (
    !hasAccessKeys &&
    !process.env.AWS_PROFILE &&
    !process.env.AWS_CONTAINER_CREDENTIALS_RELATIVE_URI
  ) {
    await fs.promises
      .unlink(path.join(UPLOAD_DIR, req.file.filename))
      .catch(() => {});
    return res.status(500).json({
      error:
        "AWS credentials not configured. Set AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY, or configure the SDK (profile/EC2/ECS role)",
    });
  }

  const key = `resumes/${req.file.filename}`;
  const filePath = path.join(UPLOAD_DIR, req.file.filename);

  try {
    const fileStream = fs.createReadStream(filePath);
    const uploadParams = {
      Bucket: bucket,
      Key: key,
      Body: fileStream,
      ContentType: req.file.mimetype,
    };

    await s3Client.send(new PutObjectCommand(uploadParams));

    const s3Url = `https://${bucket}.s3.${region}.amazonaws.com/${encodeURIComponent(
      key,
    )}`;
    console.log("Uploaded to S3:", s3Url);

    // remove local file after successful upload
    await fs.promises.unlink(filePath).catch(() => {
      console.log("Local file removed");
    });

    // attach S3 info to req.file for downstream handlers
    req.file.s3 = { bucket, key, s3Url };
    return next();
  } catch (err) {
    // try to remove local file on error
    console.error("S3 upload error:", err);
    await fs.promises
      .unlink(path.join(UPLOAD_DIR, req.file.filename))
      .catch(() => {});
    return res.status(500).json({
      error: "Failed to upload file to S3",
    });
  }
};
