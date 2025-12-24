import React from "react";
import { Card, CardContent } from "./ui/card";
import { Clock } from "lucide-react";
import { cn } from "@/lib/utils";

const Tokens = ({ consumed = 0, total = 100000 }) => {
  const percentage = total > 0 ? Math.round((consumed / total) * 100) : 0;
  const remaining = Math.max(0, total - consumed);

  // Format large numbers
  const formatNumber = (num) => {
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)}M`;
    }
    if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K`;
    }
    return num.toString();
  };

  return (
    <Card className="w-full max-w-md rounded-xl border-0 bg-white">
      <CardContent className="space-y-4 px-4">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <p className="text-sm font-medium text-gray-500">AI Token usage</p>
            <p className="text-primary text-xl font-bold">
              {percentage}% to complete
            </p>
          </div>
        </div>

        {/* Progress Bar with Dots */}
        <div className="relative">
          <div className="relative h-2.5 w-full overflow-hidden rounded-full bg-gray-200">
            {/* Filled portion */}
            <div
              className="bg-primary absolute top-0 left-0 h-full rounded-full transition-all duration-300"
              style={{ width: `${percentage}%` }}
            />

            {/* Dots positioned along the progress bar */}
            <div className="absolute top-0 left-0 h-full w-full">
              {[20, 40, 60, 80].map((pos) => {
                // Show dark blue dots within filled portion, white dots in unfilled
                const isFilled = pos <= percentage;
                return (
                  <div
                    key={pos}
                    className={cn(
                      "absolute top-1/2 size-1.5 -translate-y-1/2 rounded-full transition-colors",
                      isFilled ? "bg-primary" : "bg-white",
                    )}
                    style={{ left: `${pos}%` }}
                  />
                );
              })}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-gray-500">
          <Clock className="size-4" />
          <span>{formatNumber(remaining)} remaining</span>
        </div>
      </CardContent>
    </Card>
  );
};

export default Tokens;
