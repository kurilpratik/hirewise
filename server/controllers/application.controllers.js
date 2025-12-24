import Application from "../models/application.model.js";

export const createApplication = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }
    // req.file contains multer metadata (path, filename, originalname, size, mimetype)
    console.log("Uploaded file:", req.file);

    // TODO: persist Application to DB if needed, e.g. Application.create(...)

    return res.status(201).json({
      message: "Application created",
      file: {
        originalname: req.file.originalname,
        filename: req.file.filename,
        size: req.file.size,
        path: req.file.path,
        mimetype: req.file.mimetype,
      },
    });
  } catch (error) {
    console.error(err);
    return res.status(500).json({ error: "Server error" });
  }
};
