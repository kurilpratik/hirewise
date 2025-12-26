import CompanyFolders from "@/components/CompanyFolders";
import JobList from "@/components/JobList";
import { Separator } from "@/components/ui/separator";
import React from "react";

const HomePage = () => {
  return (
    <>
      <h1 className="text-2xl font-bold">Your Workspace</h1>
      <p className="text-sm text-gray-400">
        Manage your recruitment pipelines and candidates.
      </p>
      <section className="py-8">
        <h3 className="font-poppins pb-8 uppercase">Company Folders</h3>
        <CompanyFolders />
      </section>
      <Separator />
      <section>
        <h3 className="font-poppins pt-4 pb-8 uppercase">All Jobs</h3>
        <JobList homepage="false" />
      </section>
    </>
  );
};

export default HomePage;
