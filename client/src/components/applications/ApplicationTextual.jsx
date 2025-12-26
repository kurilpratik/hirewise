import React from "react";

import { Badge } from "../ui/badge";

const ApplicationTextual = () => {
  return (
    <div>
      <div className="max-w-md py-4">
        <h3 className="mb-2 text-xl font-semibold">Matched Skills</h3>
        <div className="mb-8 flex flex-wrap gap-1">
          <Badge variant="secondary">Reactjs</Badge>
          <Badge variant="secondary">Expressjs</Badge>
          <Badge variant="secondary">Mongodb</Badge>
          <Badge variant="secondary">Restful APIs</Badge>
          <Badge variant="secondary">Docker</Badge>
          <Badge variant="secondary">Jenkins</Badge>
          <Badge variant="secondary">Restful APIs</Badge>
          <Badge variant="secondary">Docker</Badge>
          <Badge variant="secondary">Jenkins</Badge>
        </div>
        <h3 className="mb-2 text-xl font-semibold">Missing Skills</h3>
        <div className="mb-8 flex flex-wrap gap-1">
          <Badge variant="outline">Reactjs</Badge>
          <Badge variant="outline">Expressjs</Badge>
          <Badge variant="outline">Mongodb</Badge>
          <Badge variant="outline">Restful APIs</Badge>
          <Badge variant="outline">Docker</Badge>
          <Badge variant="outline">Jenkins</Badge>
          <Badge variant="outline">Restful APIs</Badge>
          <Badge variant="outline">Docker</Badge>
          <Badge variant="outline">Jenkins</Badge>
        </div>

        <h3 className="mb-2 pb-4 text-xl font-semibold">Reasons to hire</h3>
        <ul className="list-outside list-disc space-y-4 pl-5 text-sm text-neutral-700">
          <li>
            End-to-end ownership – can take a feature from idea to production,
            reducing handoffs and speeding up delivery.
          </li>
          <li>
            Cost & team efficiency – One developer who understands both frontend
            and backend lowers dependency on multiple specialists.
          </li>
          <li>
            Better product decisions – With a holistic view of the system, they
            build solutions that are scalable, performant, and user-focused.
          </li>
        </ul>
      </div>
    </div>
  );
};

export default ApplicationTextual;
