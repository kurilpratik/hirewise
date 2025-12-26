import React, { useEffect, useRef, useState } from "react";

import { SheetContent, SheetTitle } from "@/components/ui/sheet";

import { Badge } from "./ui/badge";

import ReactMarkdown from "react-markdown";
import { cleanMarkdown } from "@/lib/cleanMarkdown";

/**
 * Module-level set to remember which jobIds have been populated already.
 * This survives remounts of the component within the same page lifecycle,
 * preventing re-starting the poll when the sidebar is closed/opened.
 */
const populatedJobs = new Set();

const JobDetails = ({ job: jobProp, jobId }) => {
  const [job, setJob] = useState(jobProp || null);
  const [loading, setLoading] = useState(!jobProp && !!jobId);
  const [error, setError] = useState(null);

  // Track whether data has been populated so we never restart polling after success
  const populatedRef = useRef(false);
  // Prevent concurrent polls
  const pollingRef = useRef(false);

  const title = job?.title ?? (loading ? "Loading..." : "Unknown Title");
  const company = job?.company ?? "Unknown Company";
  const location = job?.location ?? "Location not specified";
  const experience = job?.experience ?? "Experience not specified";
  const requiredSkills = Array.isArray(job?.requiredSkills)
    ? job.requiredSkills
    : [];
  const description =
    job?.description ?? "No description available for this job.";

  const cleanedDescription = cleanMarkdown(description);

  // Polling helper: fetch job until skills/topSkill/skillsGenerated appear or timeout
  useEffect(() => {
    const shouldStop = (data) => {
      if (!data) return false;
      if (Array.isArray(data.requiredSkills) && data.requiredSkills.length > 0)
        return true;
      if (data.topSkill) return true;
      if (data.skillsGenerated) return true;
      return false;
    };

    // If we already know this jobId was populated earlier in this session,
    // don't start the poll again. Instead fetch once to get latest data.
    if (jobId && populatedJobs.has(jobId)) {
      let controller = new AbortController();
      setLoading(true);
      fetch(`/api/jobs/${jobId}`, { signal: controller.signal })
        .then((res) => {
          if (!res.ok) throw new Error(`Fetch failed: ${res.status}`);
          return res.json();
        })
        .then((data) => {
          const payload = data?.job ?? data;
          setJob(payload);
          setError(null);
          populatedRef.current = true;
          setLoading(false);
          console.log("JobDetails: single fetch (already populated)");
        })
        .catch((err) => {
          if (err.name === "AbortError") return;
          const msg = err?.message || String(err);
          setError(msg);
          setLoading(false);
          console.log("JobDetails: single fetch error", { jobId, error: msg });
        });
      return () => controller.abort();
    }

    // If jobProp is provided, use it and mark populated if it has skills/topSkill
    if (jobProp) {
      setJob(jobProp);
      const populated = shouldStop(jobProp);
      if (populated) {
        populatedRef.current = true;
        populatedJobs.add(jobId);
        setLoading(false);
        console.log("JobDetails: initialized from props (populated)");
        return;
      } else {
        // Not populated yet — allow polling to start
        setLoading(!!jobId);
        console.log(
          "JobDetails: initialized from props (not populated), will poll",
        );
      }
    }

    if (!jobId) return;

    // If we've already seen populated data in this instance, don't start polling again
    if (populatedRef.current) {
      console.log(
        "JobDetails: skipping poll because already populated (instance)",
      );
      return;
    }
    // Avoid starting another poll if one is already running
    if (pollingRef.current) {
      console.log("JobDetails: poll already running, skipping start");
      return;
    }

    let cancelled = false;
    pollingRef.current = true;
    const intervalMs = 2000; // poll every 2s
    const timeoutMs = 30000; // stop after 30s
    let elapsed = 0;
    let controller = new AbortController();

    const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

    const poll = async () => {
      setLoading(true);
      while (!cancelled && elapsed < timeoutMs) {
        try {
          controller = new AbortController();
          const res = await fetch(`/api/jobs/${jobId}`, {
            signal: controller.signal,
          });
          if (!res.ok) {
            throw new Error(`Fetch failed: ${res.status}`);
          }
          const data = await res.json();
          const payload = data?.job ?? data;
          setJob(payload);
          setError(null);

          console.log("JobDetails: polled job");

          if (shouldStop(payload)) {
            // mark globally that data is populated so we don't poll again
            populatedRef.current = true;
            populatedJobs.add(jobId);
            pollingRef.current = false;
            console.log("JobDetails: stopping poll - data populated");
            setLoading(false);
            return;
          }
        } catch (err) {
          if (err.name === "AbortError") {
            console.log("JobDetails: fetch aborted");
            pollingRef.current = false;
            return;
          }
          const msg = err?.message || String(err);
          setError(msg);
          console.log("JobDetails: poll error", { error: msg });
          // continue polling unless cancelled
        }
        await sleep(intervalMs);
        elapsed += intervalMs;
      }

      if (!cancelled) {
        pollingRef.current = false;
        setLoading(false);
        console.log("JobDetails: poll finished (timeout or done)");
      }
    };

    poll();

    return () => {
      cancelled = true;
      pollingRef.current = false;
      controller?.abort();
      console.log("JobDetails: poll cancelled/unmounted");
    };
  }, [jobId, jobProp]);

  return (
    <SheetContent className={"overflow-y-scroll"}>
      <div className="p-4">
        <SheetTitle className={"mb-1 text-3xl"}>{title}</SheetTitle>

        <div className="mb-0 flex gap-2 text-[16px]">
          <p className="mb-2">{company}</p> |<p className="mb-2">{location}</p>{" "}
          |<p className="mb-2">{experience}</p>
        </div>

        <p className="mb-4 text-xs text-neutral-400">{jobId}</p>

        <div className="mb-2 flex flex-wrap gap-1 py-2">
          {loading && <Badge>Loading skills...</Badge>}
          {!loading && requiredSkills.length === 0 && (
            <Badge>Skills not specified</Badge>
          )}
          {!loading &&
            requiredSkills.map((s) => (
              <Badge key={s} variant="secondary">
                {s}
              </Badge>
            ))}
        </div>

        <h5 className="my-4 text-lg">
          Top Skill Needed:{" "}
          <span className="font-semibold">
            {job?.topSkill ?? requiredSkills[0] ?? "Not specified"}
          </span>
        </h5>

        <h5 className="my-2 text-lg">Job Description</h5>
        {error && <p className="text-sm text-red-500">Error: {error}</p>}
        <div className="text-sm leading-7">
          {/* <p>{description}</p> */}
          <ReactMarkdown
            components={{
              strong: ({ children }) => (
                <strong className="">{children}</strong>
              ),
              p: ({ children }) => <p className="">{children}</p>,
              li: ({ children }) => <li className="">{children}</li>,
            }}
          >
            {cleanedDescription}
          </ReactMarkdown>
        </div>
      </div>
    </SheetContent>
  );
};

export default JobDetails;
