import React from "react";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

import { Badge } from "./ui/badge";

const JobDetails = () => {
  return (
    <SheetContent>
      <div className="p-4">
        <SheetTitle className={"mb-1 text-2xl"}>
          Full Stack Developer
        </SheetTitle>
        <div className="mb-4 flex gap-2 text-[14px]">
          <p className="mb-2">KPMG</p> |<p className="mb-2">Gurugram</p> |
          <p className="mb-2">0 - 2 years exp</p>
        </div>

        <div className="mb-2 flex flex-wrap gap-1 py-2">
          <Badge>Reactjs</Badge>
          <Badge variant="secondary">Expressjs</Badge>
          <Badge>Mongodb</Badge>
          <Badge variant="">Restful APIs</Badge>
          <Badge variant="secondary">Docker</Badge>
          <Badge>Jenkins</Badge>
        </div>
        <h5 className="my-4 text-lg">
          Top Skill Needed: <span className="font-semibold">System Design</span>
        </h5>
        <h5 className="my-2 text-lg">Job Description</h5>
        <div className="space-y-4 text-sm">
          <p>
            We're looking for a Full Stack Developer who enjoys building
            scalable, high-quality web applications end-to-end. You'll work
            across frontend, backend, and databases to deliver products that are
            fast, reliable, and user-focused. If you enjoy problem-solving,
            shipping features, and continuously learning — this role is for you.
          </p>

          <div>
            <h6 className="mb-2 font-semibold">🛠️ Responsibilities</h6>
            <div className="ml-2 space-y-1">
              <div>
                Design, develop, and maintain frontend and backend features
              </div>
              <div>
                Build responsive and performant UIs using modern frameworks
              </div>
              <div>Develop APIs and server-side logic</div>
              <div>Integrate databases and third-party services</div>
              <div>
                Collaborate with designers, product managers, and engineers
              </div>
              <div>Write clean, maintainable, and testable code</div>
              <div>Debug, optimize, and improve application performance</div>
              <div>
                Participate in code reviews and contribute to best practices
              </div>
            </div>
          </div>
        </div>
      </div>
    </SheetContent>
  );
};

export default JobDetails;
