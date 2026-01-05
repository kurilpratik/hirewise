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
  FileText,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  ExternalLink,
} from "lucide-react";

const ApplicationInfo = ({ application = {} }) => {
  const candidate = application?.candidate || {};
  const email = candidate.email || application.email || "";
  const phone = candidate.phone || application.phone || "";
  const location =
    candidate.location ||
    candidate.city ||
    application.location ||
    application.city ||
    "Unknown";
  const background = candidate.background || "Not specified";
  const resumeUrl = candidate.resumePath || null;
  const name = candidate.name || application.name || "Candidate";

  return (
    <div>
      <Card className="max-w-md">
        <CardHeader>
          <CardTitle className="font-faustina mb-1 text-4xl font-bold">
            {name}
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
            {email ? (
              <a
                href={`mailto:${email}`}
                className="text-sm font-semibold text-blue-600 hover:underline"
              >
                {email}
              </a>
            ) : (
              <span className="text-sm text-neutral-500">—</span>
            )}
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Phone className="size-4 text-neutral-400" />
              <span className="text-sm">Phone</span>
            </div>
            {phone ? (
              <a
                href={`tel:${phone}`}
                className="text-sm font-semibold text-blue-600 hover:underline"
              >
                {phone}
              </a>
            ) : (
              <span className="text-sm text-neutral-500">—</span>
            )}
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MapPin className="size-4 text-neutral-400" />
              <span className="text-sm">Location</span>
            </div>
            <span className="text-sm font-semibold">{location}</span>
          </div>
          <div className="flex items-center justify-between border-t pt-2">
            <div className="flex items-center gap-2">
              <Briefcase className="size-4 text-neutral-400" />
              <span className="text-sm">Background</span>
            </div>
            <span className="text-right text-xs">{background}</span>
          </div>
          <div className="flex items-center justify-between border-t pt-2">
            <div className="flex items-center gap-2">
              <FileText className="size-4 text-neutral-400" />
              <span className="text-sm">Resume</span>
            </div>
            {resumeUrl ? (
              <Button asChild variant="secondary" size="sm" className="gap-2">
                <a href={resumeUrl} target="_blank" rel="noopener noreferrer">
                  <ExternalLink />
                  View
                </a>
              </Button>
            ) : (
              <span className="text-sm text-neutral-500">Not uploaded</span>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ApplicationInfo;
