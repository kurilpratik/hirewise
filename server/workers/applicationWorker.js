import { Worker } from "bullmq";
import {
  APPLICATION_QUEUE_NAME,
  getRedisConnection,
} from "../config/queue.js";

const connection = getRedisConnection();
if (!connection) {
  console.error(
    "[worker] Redis is not configured. Set REDIS_URL (or REDIS_HOST/REDIS_PORT).",
  );
  process.exit(1);
}

const applicationWorker = new Worker(
  APPLICATION_QUEUE_NAME,
  async (job) => {
    console.log("Processing job:", job.id);
    console.log("Application document to save:", job.data);
  },
  { connection },
);

applicationWorker.on("error", (err) => {
  console.error("[worker] error:", err?.message || err);
});
