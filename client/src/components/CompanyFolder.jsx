// client/src/components/CompanyFolder.jsx
import React from "react";
import { Folder, Plus } from "lucide-react";

const CompanyFolder = ({ company, jobs, variant, onClick }) => {
  // Add Folder variant
  if (variant === "add") {
    return (
      <div
        onClick={onClick}
        className="flex h-48 w-64 cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-300 transition-colors hover:border-gray-400 hover:bg-gray-50"
      >
        <Plus className="mb-2 h-8 w-8 text-gray-500" />
        <span className="text-sm font-medium text-gray-500">Add Job</span>
      </div>
    );
  }

  // Regular folder variant
  return (
    <div className="group relative h-48 w-64 cursor-pointer rounded-xl bg-[#E0E8F9] p-4 transition-shadow hover:shadow-sm">
      {/* Folder Tab */}
      <div className="absolute -top-2 left-4 h-6 w-16 rounded-t-lg bg-[#BCCDF7] transition-transform group-hover:-top-3"></div>

      {/* Content Container */}
      <div className="relative flex h-full flex-col">
        {/* Top Section */}
        <div className="mb-auto flex items-start justify-between">
          {/* Folder Icon */}
          <Folder className="mt-2 h-8 w-8 text-[#6A87D7]" />

          {/* Jobs Badge */}
          <div className="rounded-full bg-[#D0D9F0] px-3 py-1">
            <span className="text-sm font-medium text-[#4A69C2]">
              {jobs} {jobs === 1 ? "Job" : "Jobs"}
            </span>
          </div>
        </div>

        {/* Company Name */}
        <h3 className="font-faustina mt-auto text-3xl font-bold text-[#3A4F9B]">
          {company}
        </h3>
      </div>
    </div>
  );
};

export default CompanyFolder;
