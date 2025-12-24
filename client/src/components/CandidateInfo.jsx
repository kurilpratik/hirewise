import React from "react";

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import {
  InfoIcon,
  SlashIcon,
  FileText,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  ExternalLink,
} from "lucide-react";

const CandidateInfo = () => {
  // Sample candidate details - replace with actual candidate data from props/state/API
  const candidateDetails = {
    email: "pratikkurilworks@gmail.com",
    phone: "+91 74588 17555",
    location: "Noida",
    background: "Software Engineer",
    resumeUrl: "/resumes/pratik-kuril-resume.pdf",
  };
  return (
    <div>
      <Card className="max-w-md">
        <CardHeader>
          <CardTitle className="font-faustina mb-1 text-4xl font-bold">
            {/* Candidate Details */}
          </CardTitle>
          <CardDescription className="text-xs font-semibold text-neutral-400 uppercase">
            CONTACT & INFORMATION
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Mail className="size-4 text-neutral-400" />
              <span className="text-sm">Email</span>
            </div>
            <a
              href={`mailto:${candidateDetails.email}`}
              className="text-sm font-semibold text-blue-600 hover:underline"
            >
              {candidateDetails.email}
            </a>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Phone className="size-4 text-neutral-400" />
              <span className="text-sm">Phone</span>
            </div>
            <a
              href={`tel:${candidateDetails.phone}`}
              className="text-sm font-semibold text-blue-600 hover:underline"
            >
              {candidateDetails.phone}
            </a>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MapPin className="size-4 text-neutral-400" />
              <span className="text-sm">Location</span>
            </div>
            <span className="text-sm font-semibold">
              {candidateDetails.location}
            </span>
          </div>
          <div className="flex items-center justify-between border-t pt-2">
            <div className="flex items-center gap-2">
              <Briefcase className="size-4 text-neutral-400" />
              <span className="text-sm">Background</span>
            </div>
            <span className="text-sm font-semibold">
              {candidateDetails.background}
            </span>
          </div>
          <div className="flex items-center justify-between border-t pt-2">
            <div className="flex items-center gap-2">
              <FileText className="size-4 text-neutral-400" />
              <span className="text-sm">Resume</span>
            </div>
            <Button asChild variant="secondary" size="sm" className="gap-2">
              <a
                href={candidateDetails.resumeUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                <ExternalLink />
                View
              </a>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CandidateInfo;
