import React from "react";
import JobList from "@/components/JobList";

const JobsPage = () => {
  return (
    <div>
      <h1 className="text-2xl font-bold">All Jobs</h1>
      <p className="text-sm text-gray-400">
        Manage your recruitment pipelines and candidates.
      </p>
      <section className="py-8">
        <JobList />
      </section>
    </div>
  );
};

export default JobsPage;
