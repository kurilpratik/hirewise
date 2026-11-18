import "dotenv/config";
import { Queue } from "bullmq";

export const APPLICATION_QUEUE_NAME = "application";

const ENQUEUE_TIMEOUT_MS = 3000;
const ERROR_LOG_INTERVAL_MS = 30_000;

/**
 * Resolve the Redis/Valkey connection options from the environment.
 *
 *   REDIS_URL                 redis://user:pass@host:6379 (rediss:// enables TLS)
 *   REDIS_HOST / REDIS_PORT   alternative to REDIS_URL
 *
 * Outside production, falls back to localhost:6379 (docker-compose valkey).
 * In production there is no sensible default, so returns null and background
 * jobs stay disabled instead of retrying a host that cannot exist.
 */
export function getRedisConnection() {
  const url = process.env.REDIS_URL;
  if (url) {
    try {
      const parsed = new URL(url);
      return {
        host: parsed.hostname,
        port: Number(parsed.port) || 6379,
        username: parsed.username
          ? decodeURIComponent(parsed.username)
          : undefined,
        password: parsed.password
          ? decodeURIComponent(parsed.password)
          : undefined,
        ...(parsed.protocol === "rediss:" ? { tls: {} } : {}),
      };
    } catch {
      console.warn("[queue] REDIS_URL is not a valid URL; ignoring it");
      return null;
    }
  }

  if (process.env.REDIS_HOST) {
    return {
      host: process.env.REDIS_HOST,
      port: Number(process.env.REDIS_PORT) || 6379,
    };
  }

  if (process.env.NODE_ENV !== "production") {
    return { host: "localhost", port: 6379 };
  }

  return null;
}

let applicationQueue; // undefined = not created yet, null = disabled

function getApplicationQueue() {
  if (applicationQueue !== undefined) return applicationQueue;

  const connection = getRedisConnection();
  if (!connection) {
    console.warn(
      "[queue] Redis is not configured (set REDIS_URL); background jobs are disabled",
    );
    applicationQueue = null;
    return applicationQueue;
  }

  // enableOfflineQueue: false makes commands fail immediately while Redis is
  // unreachable, rather than buffering them until it comes back.
  applicationQueue = new Queue(APPLICATION_QUEUE_NAME, {
    connection: { ...connection, enableOfflineQueue: false },
  });

  // Without a listener an 'error' event can take the process down. Throttle the
  // log so an unreachable Redis doesn't flood it with one line per retry.
  let lastLoggedAt = 0;
  applicationQueue.on("error", (err) => {
    const now = Date.now();
    if (now - lastLoggedAt < ERROR_LOG_INTERVAL_MS) return;
    lastLoggedAt = now;
    console.warn("[queue] Redis error:", err?.message || err);
  });

  return applicationQueue;
}

/**
 * Add a job for further processing. Never throws and never blocks for more than
 * a few seconds: the queue is a side effect, so an unavailable Redis must not
 * fail a request whose application has already been saved.
 *
 * @returns {Promise<boolean>} whether the job was enqueued
 */
export async function enqueueApplication(data) {
  let timer;
  try {
    const queue = getApplicationQueue();
    if (!queue) return false;

    const timeout = new Promise((_, reject) => {
      timer = setTimeout(
        () => reject(new Error("timed out waiting for Redis")),
        ENQUEUE_TIMEOUT_MS,
      );
    });

    await Promise.race([queue.add("file-ready", data), timeout]);
    return true;
  } catch (err) {
    console.warn("[queue] Could not enqueue application:", err?.message || err);
    return false;
  } finally {
    clearTimeout(timer);
  }
}
