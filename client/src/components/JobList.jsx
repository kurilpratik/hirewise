import React from "react";

import {
  ItemGroup,
  Item,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from "./ui/item";

import { JOBLIST } from "@/data/data";
import { Link } from "react-router-dom";

const JobList = () => {
  return (
    <div className="flex w-full max-w-4xl flex-col gap-6">
      <ItemGroup className={"gap-4"}>
        {JOBLIST.map((job) => (
          <Item asChild variant="outline">
            <Link to={"/jobs/:id"}>
              <ItemMedia />
              <ItemContent>
                <ItemDescription className={"font-faustina text-2xl font-bold"}>
                  {job.position}
                </ItemDescription>
                <ItemTitle className="text-neutral-600">
                  {job.company}
                </ItemTitle>
              </ItemContent>
              <ItemContent className="items-center justify-center text-center">
                <ItemTitle className={"text-2xl font-semibold"}>
                  {job.resumes}
                </ItemTitle>
                <ItemDescription className={"text-xs text-neutral-500"}>
                  Resumes
                </ItemDescription>
              </ItemContent>
              {/* <ItemActions /> */}
            </Link>
          </Item>
        ))}
      </ItemGroup>
    </div>
  );
};

export default JobList;
