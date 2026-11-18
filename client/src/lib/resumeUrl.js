/**
 * Turn a stored candidate.resumePath into a URL the browser can open.
 *
 * - https://... (S3)                      -> used as is
 * - /uploads/resumes/<file> (local disk)  -> served by the API, prefixed with apiBase
 * - legacy absolute/relative disk paths   -> older records stored the raw multer path
 *   (e.g. C:\...\server\uploads\resumes\<file>), which browsers refuse to open as
 *   file://. Map those onto the same /uploads/resumes route.
 */
export function resolveResumeUrl(resumePath, apiBase = "") {
  if (!resumePath) return null;

  const raw = String(resumePath).trim();
  if (!raw) return null;
  if (/^https?:\/\//i.test(raw)) return raw;

  const base = String(apiBase || "").replace(/\/+$/, "");
  const normalized = raw.replace(/\\/g, "/");

  const marker = "/uploads/resumes/";
  const markerIndex = normalized.lastIndexOf(marker);
  const relative =
    markerIndex !== -1
      ? normalized.slice(markerIndex)
      : `${marker}${normalized.split("/").pop()}`;

  return `${base}${relative}`;
}

/** File name to show for a stored resumePath. */
export function resumeFileName(resumePath) {
  const name = String(resumePath || "")
    .split(/[\\/]/)
    .pop();
  try {
    return decodeURIComponent(name);
  } catch {
    return name;
  }
}
