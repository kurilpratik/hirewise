import "dotenv/config";
import fs from "fs";
import path from "path";
import multer from "multer";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

process.env.AWS_SDK_JS_SUPPRESS_MAINTENANCE_NODE_MESSAGE = "1";

export const UPLOAD_DIR = path.resolve(process.cwd(), "server", "uploads", "resumes");
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

// RESUME STORAGE
//
// Multer always writes the upload to UPLOAD_DIR first, because the PDF is read
// from disk afterwards. storeResume() then decides where the file is served from:
//   - S3 when AWS_S3_BUCKET_NAME and credentials are configured
//   - otherwise the local disk, via the /uploads/resumes static route
// Note: on hosts with an ephemeral disk (e.g. Render) the local fallback is lost
// on every deploy, so production should use S3.

const DEFAULT_REGION = "eu-north-1";

function hasS3Credentials() {
  return (
    (!!process.env.AWS_ACCESS_KEY_ID && !!process.env.AWS_SECRET_ACCESS_KEY) ||
    !!process.env.AWS_PROFILE ||
    !!process.env.AWS_CONTAINER_CREDENTIALS_RELATIVE_URI
  );
}

export function isS3Configured() {
  return !!process.env.AWS_S3_BUCKET_NAME && hasS3Credentials();
}

let s3Client;
function getS3Client() {
  if (s3Client) return s3Client;
  const region = process.env.AWS_REGION || DEFAULT_REGION;
  const hasAccessKeys =
    !!process.env.AWS_ACCESS_KEY_ID && !!process.env.AWS_SECRET_ACCESS_KEY;
  s3Client = new S3Client(
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
  return s3Client;
}

let warnedLocalStorage = false;

function localResult(file) {
  return {
    storage: "local",
    url: `/uploads/resumes/${encodeURIComponent(file.filename)}`,
  };
}

/**
 * Persist an uploaded resume and return where it can be fetched from.
 * Does NOT delete the local file; call removeLocalFile() once it has been read.
 *
 * @param {Express.Multer.File} file
 * @returns {Promise<{ storage: "s3" | "local", url: string, bucket?: string, key?: string }>}
 */
export async function storeResume(file) {
  if (!isS3Configured()) {
    if (!warnedLocalStorage) {
      warnedLocalStorage = true;
      console.warn(
        "[storage] S3 is not configured; resumes are kept on local disk" +
          (process.env.NODE_ENV === "production"
            ? " and will be lost on redeploy. Set AWS_S3_BUCKET_NAME and AWS credentials."
            : "."),
      );
    }
    return localResult(file);
  }

  const bucket = process.env.AWS_S3_BUCKET_NAME;
  const region = process.env.AWS_REGION || DEFAULT_REGION;
  const key = `resumes/${file.filename}`;

  try {
    // Uploads are capped at 5 MB, so buffering is fine and avoids the unknown
    // content-length issues of streaming bodies.
    const body = await fs.promises.readFile(file.path);
    await getS3Client().send(
      new PutObjectCommand({
        Bucket: bucket,
        Key: key,
        Body: body,
        ContentType: file.mimetype,
      }),
    );
  } catch (err) {
    // In production a failed upload must surface: the local disk is ephemeral,
    // so falling back would silently produce links that die on the next deploy.
    if (process.env.NODE_ENV === "production") throw err;

    // In development a stale or missing AWS key shouldn't block the whole
    // upload flow, so keep the file locally and say why.
    console.warn(
      `[storage] S3 upload failed (${err?.name || "Error"}: ${err?.message || err}). ` +
        "Falling back to local disk because NODE_ENV is not production. " +
        "Fix the AWS_* values in .env before deploying.",
    );
    return localResult(file);
  }

  const encodedKey = key.split("/").map(encodeURIComponent).join("/");
  const url = `https://${bucket}.s3.${region}.amazonaws.com/${encodedKey}`;
  return { storage: "s3", url, bucket, key };
}

/** Best-effort removal of the multer temp file. */
export async function removeLocalFile(file) {
  if (!file?.path) return;
  await fs.promises.unlink(file.path).catch(() => {});
}
