import React from "react";

import { Link } from "react-router-dom";
import { InfoIcon, SlashIcon } from "lucide-react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CandidateList from "@/components/CandidateList";
import UploadResumes from "@/components/UploadResumes";
import JobDetails from "@/components/JobDetails";

const JobDetailsPage = () => {
  return (
    <div className="py-2">
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
            <BreadcrumbPage>KPMG</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <div className="flex items-baseline gap-2">
        <h1 className="py-3 text-3xl font-bold">Full Stack Developer</h1>
        <Sheet className="w-2xl">
          <SheetTrigger>
            <Button
              size="icon-sm"
              className={
                "bg-secondary text-secondary-foreground hover:bg-secondary cursor-pointer rounded-4xl p-0"
              }
            >
              <InfoIcon />
            </Button>
          </SheetTrigger>
          <JobDetails />
        </Sheet>
      </div>
      <p className="mb-3 max-w-3xl text-sm text-neutral-500">
        We’re looking for a Full Stack Developer who enjoys building scalable,
        high-quality web applications end-to-end. You’ll work across frontend,
        backend, and databases to deliver products that are fast, reliable, and
        user-focused.
      </p>

      <Tabs defaultValue="candidates" className={"mt-4"}>
        <TabsList className={"mb-2"}>
          <TabsTrigger value="candidates">All Candidates</TabsTrigger>
          <TabsTrigger value="resumes">Upload Resumes</TabsTrigger>
        </TabsList>
        <TabsContent value="candidates">
          <CandidateList />
        </TabsContent>
        <TabsContent value="resumes">
          <UploadResumes />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default JobDetailsPage;
