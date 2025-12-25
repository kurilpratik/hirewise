import path from "path";
import express from "express";
import cors from "cors";
import connectDB from "./config/database.js";

import appsRoutes from "./routes/application.routes.js";
import jobRoutes from "./routes/job.routes.js";

const PORT = process.env.PORT || 5000;
const __dirname = path.resolve();

const app = express();
app.use(cors());
app.use(express.json());

// Method to test by logging any route that is hit
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next(); // Ensure next() is called
});

app.use("/api/apps", appsRoutes);
app.use("/api/jobs", jobRoutes);

app.get("/api/health", (req, res) => {
  res.json({ status: "OK" });
});

// The wildcard * needs to appear after all the routes
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "client/dist")));

  app.get(/.*/, (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "dist", "index.html"));
  });
}

// 404 handler - must be after all other routes
app.use((req, res) => {
  res.status(404).json({
    error: "Not Found",
    message: `Cannot ${req.method} ${req.url}`,
  });
});

// Global error handler - must be last middleware
app.use((err, req, res, next) => {
  console.error("Error:", err);

  const statusCode = err.statusCode || 500;
  const message =
    process.env.NODE_ENV === "production"
      ? "Internal Server Error"
      : err.message;

  res.status(statusCode).json({
    error: err.name || "Error",
    message,
    ...(process.env.NODE_ENV !== "production" && { stack: err.stack }),
  });
});

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Failed to start server:", error);
    process.exit(1);
  });
