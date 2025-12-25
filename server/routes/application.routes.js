import express from "express";
import { createApplication } from "../controllers/application.controllers.js";
import { multerErrorHandler, uploadSingle } from "../middleware/upload.midd.js";

const router = express.Router();

// use multer single-file middleware (field name: "file")
router.post("/create", uploadSingle, createApplication);

// attach multer error handler to this router (or add it on app level)
router.use(multerErrorHandler);

export default router;
