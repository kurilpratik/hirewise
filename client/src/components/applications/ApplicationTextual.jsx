import React from "react";

import { Badge } from "../ui/badge";

const ApplicationTextual = ({ application = {} }) => {
  const candidate = application?.candidate || {};

  const matchedSkills = Array.isArray(application?.matchedSkills)
    ? application.matchedSkills
    : Array.isArray(candidate?.extractedSkills)
      ? candidate.extractedSkills
      : [];

  const missingSkills = Array.isArray(application?.missingSkills)
    ? application.missingSkills
    : Array.isArray(application?.job?.requiredSkills)
      ? application.job.requiredSkills
      : [];

  const topReasons = Array.isArray(application?.topReasonsToHire)
    ? application.topReasonsToHire
    : [];

  return (
    <div>
      <div className="max-w-md py-4">
        <h3 className="mb-2 text-xl font-semibold">Matched Skills</h3>
        <div className="mb-8 flex flex-wrap gap-1">
          {matchedSkills.length ? (
            matchedSkills.slice(0, 100).map((s, i) => (
              <Badge key={`${s}-${i}`} variant="secondary">
                {s}
              </Badge>
            ))
          ) : (
            <div className="text-sm text-neutral-500">
              No matched skills found.
            </div>
          )}
        </div>

        <h3 className="mb-2 text-xl font-semibold">Missing Skills</h3>
        <div className="mb-8 flex flex-wrap gap-1">
          {missingSkills.length ? (
            missingSkills.slice(0, 100).map((s, i) => (
              <Badge key={`miss-${s}-${i}`} variant="outline">
                {s}
              </Badge>
            ))
          ) : (
            <div className="text-sm text-neutral-500">
              No missing skills detected.
            </div>
          )}
        </div>

        <h3 className="mb-2 pb-4 text-xl font-semibold">Reasons to hire</h3>
        {topReasons.length ? (
          <ul className="list-outside list-disc space-y-4 pl-5 text-sm text-neutral-700">
            {topReasons.slice(0, 3).map((r, i) => (
              <li key={`reason-${i}`}>{r}</li>
            ))}
          </ul>
        ) : (
          <div className="text-sm text-neutral-500">No reasons available.</div>
        )}
      </div>
    </div>
  );
};

export default ApplicationTextual;
