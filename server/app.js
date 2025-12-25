import express from "express";

import appsRoutes from "./routes/application.routes.js";
import jobRoutes from "./routes/job.routes.js";

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

export default app;
