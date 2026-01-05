import React, { useEffect, useState } from "react";

import { Link, useParams } from "react-router-dom";
import { SlashIcon } from "lucide-react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

import ApplicationRank from "@/components/applications/ApplicationRank";
import ApplicationInfo from "@/components/applications/ApplicationInfo";
import ApplicationTextual from "@/components/applications/ApplicationTextual";

const ApplicationPage = () => {
  const { id } = useParams();
  const [application, setApplication] = useState(null);
  const [loading, setLoading] = useState(Boolean(id));
  const [error, setError] = useState(null);

  const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    setError(null);

    // console.log("Fetching Application details for ID:", id);

    (async () => {
      try {
        const res = await fetch(`${API_BASE}/api/apps/${id}`);
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || "Failed to load application");
        }
        setApplication(data.application || null);
      } catch (err) {
        console.error("Fetch application error:", err);
        setError(err.message || "Error");
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  const candidate = application?.candidate || {};
  const matchedSkills = Array.isArray(application?.matchedSkills)
    ? application.matchedSkills
    : [];
  const topReasons = Array.isArray(application?.topReasonsToHire)
    ? application.topReasonsToHire
    : [];
  const rankAvailable =
    typeof application?.score === "number" && application.score !== null;
  const jobId = application?.jobId || application?.job_id || null;

  return (
    <div className="px-4 py-2">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link to={"/home"}>Home</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator>
            <SlashIcon />
          </BreadcrumbSeparator>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link to={"/jobs"}>All Jobs</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator>
            <SlashIcon />
          </BreadcrumbSeparator>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link to={`/jobs/${jobId || "unknown"}`}>
                {jobId || "Unknown Job"}
              </Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator>
            <SlashIcon />
          </BreadcrumbSeparator>
          <BreadcrumbItem>
            <BreadcrumbPage>{candidate.name || "Candidate"}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {loading ? (
        <h1 className="py-3 text-2xl font-medium">Loading application…</h1>
      ) : error ? (
        <h1 className="py-3 text-2xl font-medium text-red-600">
          Error: {error}
        </h1>
      ) : (
        <>
          <h1 className="py-3 text-3xl font-bold">
            {candidate.name || "Unknown Candidate"}
          </h1>

          <section className="flex">
            {/* CARDS */}
            <div className="flex flex-1 flex-col gap-8">
              <div>
                <ApplicationRank application={application} />
              </div>
              <ApplicationInfo application={application} />
            </div>

            {/* TEXTUAL */}
            <div className="textual ml-6 flex-1">
              <ApplicationTextual application={application} />
            </div>
          </section>
        </>
      )}
    </div>
  );
};

export default ApplicationPage;
