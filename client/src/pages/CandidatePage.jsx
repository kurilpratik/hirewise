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

import CandidateRank from "@/components/CandidateRank";
import CandidateInfo from "@/components/CandidateInfo";
import CandidateTextual from "@/components/CandidateTextual";

const CandidatePage = () => {
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
          <CandidateRank />
          <CandidateInfo />
        </div>
        {/* TEXTUAL */}
        <div className="textual flex-1">
          <CandidateTextual />
        </div>
      </section>
    </div>
  );
};

export default CandidatePage;
