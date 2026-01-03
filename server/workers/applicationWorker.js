import { Worker } from "bullmq";

const applicationWorker = new Worker(
  "application",
  async (job) => {
    console.log("Processing job:", job.id);
    console.log("Application document to save:", job.data);
  },
  {
    connection: {
      host: "localhost",
      port: 6379, //valkey port
    },
  },
);
