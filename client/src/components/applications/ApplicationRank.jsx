import React from "react";

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const ApplicationRank = () => {
  // Sample data - replace with actual candidate data from props/state/API
  const candidateRank = {
    rank: 1,
    score: 95,
    status: "Top Candidate",
    totalApplicants: 25,
  };
  return (
    <div>
      <Card className="max-w-md">
        <CardHeader>
          <CardTitle className="font-faustina mb-1 text-6xl font-bold">
            <span className="text-2xl text-neutral-400">#</span>
            {candidateRank.rank}
          </CardTitle>
          <CardDescription className="text-xs font-semibold text-neutral-400 uppercase">
            RANK
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm">Score</span>
            <span className="text-lg font-semibold text-green-600">
              {candidateRank.score}%
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm">Status</span>
            <Badge
              variant="default"
              className="bg-green-600 text-white hover:bg-green-600"
            >
              {candidateRank.status}
            </Badge>
          </div>
          <div className="flex items-center justify-between border-t pt-2">
            <span className="text-sm">Out of</span>
            <span className="text-lg font-semibold">
              {candidateRank.totalApplicants} Candidates
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ApplicationRank;
