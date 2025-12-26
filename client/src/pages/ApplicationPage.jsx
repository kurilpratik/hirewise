import React from "react";

import { Link } from "react-router-dom";
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
  return (
    <div>
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
              <Link to={"#"}>JOB ID</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator>
            <SlashIcon />
          </BreadcrumbSeparator>
          <BreadcrumbItem>
            <BreadcrumbPage>Pratik Kuril</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <h1 className="py-3 text-3xl font-bold">Pratik Kuril</h1>

      <section className="flex">
        {/* CARDS */}
        <div className="flex flex-1 flex-col gap-8">
          <ApplicationRank />
          <ApplicationInfo />
        </div>
        {/* TEXTUAL */}
        <div className="textual flex-1">
          <ApplicationTextual />
        </div>
      </section>
    </div>
  );
};

export default ApplicationPage;
