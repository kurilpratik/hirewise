import React, { useState, useEffect, use } from "react";
import { useParams } from "react-router-dom";

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const ApplicationRank = ({ application = {} }) => {
  const id = application.jobId || application.job_id || null;
  const [loading, setLoading] = useState(Boolean(id));
  const [error, setError] = useState(null);
  const [totalApplications, setTotalApplications] = useState(0);

  const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";

  useEffect(() => {
    const fetchApplicationStats = async () => {
      if (!id) return;
      setLoading(true);
      setError(null);

      try {
        const res = await fetch(`${API_BASE}/api/jobs/${id}/apps/stats`);
        if (!res.ok) throw new Error("Failed to fetch application statistics");
        const payload = await res.json();
        console.log("Application stats payload:", payload);
        setTotalApplications(payload?.stats?.totalApplications ?? 0);
      } catch (err) {
        console.error("Fetch application stats error:", err);
        setError(err.message || "Error");
      } finally {
        setLoading(false);
      }
    };

    fetchApplicationStats();
  }, [id]);

  const score =
    typeof application.score === "number" ? application.score : null;

  // determine rank, but force N/A when score === 0
  let rank =
    typeof application.rank === "number"
      ? application.rank
      : typeof application.position === "number"
        ? application.position
        : null;

  if (score === 0) {
    rank = null;
  }

  const totalApplicants =
    typeof application.totalApplicants === "number"
      ? application.totalApplicants
      : typeof application.total_applicants === "number"
        ? application.total_applicants
        : typeof application.totalApplicantsCount === "number"
          ? application.totalApplicantsCount
          : null;

  // if score === 0 always show "Working on it", overriding application.status
  const status =
    score === 0
      ? "Working on it"
      : application.status ||
        (score !== null
          ? score >= 90
            ? "Top Candidate"
            : score >= 75
              ? "Strong"
              : score >= 50
                ? "Average"
                : "Low"
          : "Unknown");

  return (
    <div>
      <Card className="max-w-md">
        <CardHeader>
          <CardTitle className="font-faustina mb-1 text-6xl font-bold">
            <span className="text-2xl text-neutral-400">#</span>
            {rank !== null ? rank : "N/A"}
          </CardTitle>
          <CardDescription className="text-xs font-semibold text-neutral-400 uppercase">
            RANK
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm">Score</span>
            <span
              className={`text-lg font-semibold ${
                score !== null && score >= 75
                  ? "text-green-600"
                  : "text-amber-600"
              }`}
            >
              {score !== null ? `${score}%` : "N/A"}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm">Status</span>
            <Badge
              variant="default"
              className={`${
                status === "Top Candidate"
                  ? "bg-green-600 text-white hover:bg-green-600"
                  : status === "Strong"
                    ? "bg-emerald-500 text-white"
                    : status === "Consider"
                      ? "bg-amber-500 text-white"
                      : "bg-gray-300 text-gray-800"
              }`}
            >
              {status}
            </Badge>
          </div>
          <div className="flex items-center justify-between border-t pt-2">
            <span className="text-sm">Out of</span>
            <span className="text-lg font-semibold">
              {totalApplications !== null
                ? `${totalApplications} Candidates`
                : "N/A"}
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ApplicationRank;
