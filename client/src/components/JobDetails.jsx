import React, { useEffect, useState } from "react";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

import { Badge } from "./ui/badge";

const JobDetails = ({ job: jobProp, jobId }) => {
  const [job, setJob] = useState(jobProp || null);
  const [loading, setLoading] = useState(!jobProp && !!jobId);
  const [error, setError] = useState(null);

  const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";

  useEffect(() => {
    if (jobProp) return;
    if (!jobId) return;

    setLoading(true);
    setError(null);

    fetch(`${API_BASE}/api/jobs/${jobId}`)
      .then(async (res) => {
        const payload = await res.json().catch(() => ({}));
        if (!res.ok) throw new Error(payload.message || "Failed to fetch job");
        return payload;
      })
      .then((data) => {
        setJob(data.job || null);
      })
      .catch((err) => {
        setError(err.message);
      })
      .finally(() => setLoading(false));
  }, [jobId, jobProp]);

  const title = job?.title ?? (loading ? "Loading..." : "Unknown Title");
  const company = job?.company ?? "Unknown Company";
  const location = job?.location ?? "Location not specified";
  const experience = job?.experience ?? "Experience not specified";
  const requiredSkills = Array.isArray(job?.requiredSkills)
    ? job.requiredSkills
    : [];
  const description =
    job?.description ?? "No description available for this job.";

  return (
    <SheetContent>
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
            {requiredSkills[0] ?? "Not specified"}
          </span>
        </h5>

        <h5 className="my-2 text-lg">Job Description</h5>
        {error && <p className="text-sm text-red-500">Error: {error}</p>}
        <div className="space-y-4 text-sm whitespace-pre-wrap">
          <p>{description}</p>
        </div>
      </div>
    </SheetContent>
  );
};

export default JobDetails;
