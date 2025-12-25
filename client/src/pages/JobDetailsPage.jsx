import React, { useEffect, useState } from "react";

import { Link, useParams } from "react-router-dom";
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

import ReactMarkdown from "react-markdown";

const JobDetailsPage = () => {
  const { id } = useParams();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const MAX_DESC_LEN = 250;

  const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    setError(null);

    fetch(`${API_BASE}/api/jobs/${id}`)
      .then(async (res) => {
        const payload = await res.json().catch(() => ({}));
        if (!res.ok) throw new Error(payload.message || "Failed to fetch job");
        return payload;
      })
      .then((data) => {
        setJob(data.job || null);
      })
      .catch((err) => {
        setError(err.message);
      })
      .finally(() => setLoading(false));
  }, [id]);

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
            <BreadcrumbPage>{job ? job.company : "Job"}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Move Sheet to wrap both the header and the description so we can add an additional SheetTrigger inside the description */}
      <Sheet className="w-2xl">
        <div className="flex items-baseline gap-2">
          <h1 className="py-3 text-3xl font-bold">
            {loading ? "Loading..." : job ? job.title : "Job not found"}
          </h1>
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
        </div>

        {error && (
          <p className="mb-3 max-w-3xl text-sm text-red-500">Error: {error}</p>
        )}

        {!error && (
          <p className="mb-3 max-w-3xl text-sm text-neutral-500">
            {loading
              ? "Loading job description..."
              : job?.description
                ? (() => {
                    const full = job.description || "";
                    const isLong = full.length > MAX_DESC_LEN;
                    const first = isLong ? full.slice(0, MAX_DESC_LEN) : full;
                    // When truncated, append an inline markdown link that we intercept and render as a button
                    // Only render truncated text + a "Show more" link that opens the Sheet.
                    const markdownToRender =
                      first + (isLong ? " … [Show more](#show-more)" : "");

                    return (
                      <ReactMarkdown
                        components={{
                          a: ({ href, children, ...props }) => {
                            if (href === "#show-more") {
                              // Render the "Show more" link as a SheetTrigger button so it opens the same sheet
                              return (
                                <SheetTrigger asChild>
                                  <button
                                    type="button"
                                    className="text-primary ml-2 text-sm underline"
                                    {...props}
                                  >
                                    {children}
                                  </button>
                                </SheetTrigger>
                              );
                            }
                            // Default anchor behavior for other links
                            return (
                              <a href={href} {...props}>
                                {children}
                              </a>
                            );
                          },
                        }}
                      >
                        {markdownToRender}
                      </ReactMarkdown>
                    );
                  })()
                : "No description available for this job."}
          </p>
        )}

        <SheetContent>
          <JobDetails jobId={id} job={job} />
        </SheetContent>
      </Sheet>

      <Tabs defaultValue="candidates" className={"mt-4"}>
        <TabsList className={"mb-2"}>
          <TabsTrigger value="candidates">All Candidates</TabsTrigger>
          <TabsTrigger value="resumes">Upload Resumes</TabsTrigger>
        </TabsList>
        <TabsContent value="candidates">
          <CandidateList jobId={id} />
        </TabsContent>
        <TabsContent value="resumes">
          <UploadResumes jobId={id} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default JobDetailsPage;
