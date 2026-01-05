import React, { useEffect, useState } from "react";

import { ItemGroup, Item, ItemContent, ItemTitle } from "../ui/item";

import { Link, useParams } from "react-router-dom";

const ApplicationList = ({ jobId: propJobId }) => {
  const { jobId: routeJobId } = useParams();
  const jobId = propJobId || routeJobId;

  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const getRankDecoration = (rank) => {
    if (rank === 1) {
      return {
        rankText: "text-yellow-900",
        borderColor: "border-yellow-500",
      };
    } else if (rank === 2) {
      return {
        rankText: "text-gray-900",
        borderColor: "border-gray-400",
      };
    } else if (rank === 3) {
      return {
        rankText: "text-amber-900",
        borderColor: "border-amber-500",
      };
    }
    return {
      rankBg: "bg-neutral-100",
      rankText: "text-neutral-900",
      borderColor: "border-border",
      bgColor: "",
      icon: "",
    };
  };

  const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";

  useEffect(() => {
    if (!jobId) {
      setError("No jobId specified");
      return;
    }

    let cancelled = false;
    const fetchApplications = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`${API_BASE}/api/apps/job/${jobId}`);
        if (!res.ok) {
          const body = await res.json().catch(() => ({}));
          throw new Error(body.error || `Request failed: ${res.status}`);
        }
        const data = await res.json();
        if (!cancelled) {
          setApplications(
            Array.isArray(data.applications) ? data.applications : [],
          );
        }
      } catch (err) {
        if (!cancelled) setError(err.message || "Failed to load applications");
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchApplications();
    return () => {
      cancelled = true;
    };
  }, [jobId]);

  if (!jobId) {
    return (
      <div className="flex w-full max-w-5xl p-4 text-sm text-neutral-600">
        No job selected
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex w-full max-w-5xl p-4 text-sm text-neutral-600">
        Loading applications...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex w-full max-w-5xl p-4 text-sm text-red-600">
        {error}
      </div>
    );
  }

  if (!applications.length) {
    return (
      <div className="flex w-full max-w-5xl p-4 text-sm text-neutral-600">
        No applications present to be ranked
      </div>
    );
  }

  return (
    <div className="flex w-full max-w-5xl flex-col gap-4">
      <ItemGroup className={"gap-4"}>
        {applications.map((app) => {
          const candidate = app.candidate || {};
          const decoration = getRankDecoration(app.rank);
          const isTopThree = (app.rank || 999) <= 3;

          const resumeHref = candidate.resumePath
            ? String(candidate.resumePath).startsWith("http")
              ? String(candidate.resumePath)
              : `${API_BASE.replace(/\/+$/, "")}/${String(candidate.resumePath).replace(/^\/+/, "")}`
            : null;

          const resumeLabel = resumeHref
            ? String(candidate.resumePath).split("/").pop()
            : (candidate.resumeText &&
                `${String(candidate.resumeText).slice(0, 40)}...`) ||
              "—";

          return (
            <Item
              asChild
              variant="outline"
              className={
                isTopThree ? `${decoration.borderColor} border shadow-md` : ""
              }
              key={app._id || `${app.rank}${candidate.name}`}
            >
              <Link
                to={`/applications/${app._id}`}
                className="grid w-full grid-cols-[auto_1fr_1fr_1fr_1fr] items-center gap-4"
              >
                <ItemContent>
                  <div className="relative">
                    <ItemTitle
                      className={`font-faustina rounded-lg px-3 py-2 pr-4 text-xl font-bold ${decoration.rankText} flex min-w-[60px] items-center justify-center gap-2`}
                    >
                      <span>{app.rank || "—"}</span>
                    </ItemTitle>
                  </div>
                </ItemContent>
                <div className="details col-span-4 grid grid-cols-4 items-center">
                  <ItemContent>
                    <ItemTitle
                      className={`text-left ${isTopThree ? "font-semibold text-neutral-900" : "text-neutral-600"}`}
                    >
                      {candidate.name || "Unknown Candidate"}
                    </ItemTitle>
                  </ItemContent>
                  <ItemContent>
                    <ItemTitle
                      className={
                        isTopThree
                          ? "font-semibold text-neutral-900"
                          : "text-neutral-600"
                      }
                    >
                      {typeof app.score === "number" ? `${app.score} %` : "—"}
                    </ItemTitle>
                  </ItemContent>
                  <ItemContent>
                    <ItemTitle
                      className={
                        isTopThree
                          ? "font-semibold text-neutral-900"
                          : "text-neutral-600"
                      }
                    >
                      {candidate.location || "—"}
                    </ItemTitle>
                  </ItemContent>
                  <ItemContent>
                    <ItemTitle
                      className={
                        isTopThree
                          ? "font-semibold text-neutral-900"
                          : "text-neutral-600"
                      }
                    >
                      {resumeHref ? (
                        <a
                          href={resumeHref}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline"
                        >
                          View resume
                        </a>
                      ) : (
                        resumeLabel
                      )}
                    </ItemTitle>
                  </ItemContent>
                </div>
              </Link>
            </Item>
          );
        })}
      </ItemGroup>
    </div>
  );
};

export default ApplicationList;
