import React from "react";
import JobList from "@/components/JobList";
import PageHeader from "@/layouts/PageHeader";

const JobsPage = () => {
  return (
    <div>
      <PageHeader>
        <h1 className="text-2xl font-bold">All Jobs</h1>
        <p className="text-sm text-gray-400">
          Manage your recruitment pipelines and candidates.
        </p>
      </PageHeader>
      <section className="px-8 py-2">
        <JobList />
      </section>
    </div>
  );
};

export default JobsPage;
