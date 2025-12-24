import React from "react";

import {
  ItemGroup,
  Item,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from "./ui/item";

import { CANDIDATELIST } from "@/data/data";
import { Link } from "react-router-dom";

const CandidateList = () => {
  const getRankDecoration = (rank) => {
    if (rank === 1) {
      return {
        rankText: "text-yellow-900",
        borderColor: "border-yellow-500",
      };
    } else if (rank === 2) {
      return {
        rankText: "text-gray-900",
        borderColor: "border-gray-400",
      };
    } else if (rank === 3) {
      return {
        rankText: "text-amber-900",
        borderColor: "border-amber-500",
      };
    }
    return {
      rankBg: "bg-neutral-100",
      rankText: "text-neutral-900",
      borderColor: "border-border",
      bgColor: "",
      icon: "",
    };
  };

  return (
    <div className="flex w-full max-w-5xl flex-col gap-4">
      <ItemGroup className={"gap-4"}>
        {CANDIDATELIST.map((candidate) => {
          const decoration = getRankDecoration(candidate.rank);
          const isTopThree = candidate.rank <= 3;

          return (
            <Item
              asChild
              variant="outline"
              className={
                isTopThree ? `${decoration.borderColor} border shadow-md` : ""
              }
            >
              <Link
                to={"/candidates/:id"}
                className="grid w-full grid-cols-[auto_1fr_1fr_1fr_1fr] items-center gap-4"
              >
                <ItemContent>
                  <div className="relative">
                    <ItemTitle
                      className={`font-faustina rounded-lg px-3 py-2 pr-4 text-xl font-bold ${decoration.rankText} flex min-w-[60px] items-center justify-center gap-2`}
                    >
                      {/* {isTopThree && (
                        <span className="text-2xl">{decoration.icon}</span>
                      )} */}
                      <span>{candidate.rank}</span>
                    </ItemTitle>
                  </div>
                </ItemContent>
                <div className="details col-span-4 grid grid-cols-4 items-center">
                  <ItemContent>
                    <ItemTitle
                      className={`text-left ${
                        isTopThree
                          ? "font-semibold text-neutral-900"
                          : "text-neutral-600"
                      }`}
                    >
                      {candidate.name}
                    </ItemTitle>
                  </ItemContent>
                  <ItemContent>
                    <ItemTitle
                      className={
                        isTopThree
                          ? "font-semibold text-neutral-900"
                          : "text-neutral-600"
                      }
                    >
                      {candidate.score} %
                    </ItemTitle>
                  </ItemContent>
                  <ItemContent>
                    <ItemTitle
                      className={
                        isTopThree
                          ? "font-semibold text-neutral-900"
                          : "text-neutral-600"
                      }
                    >
                      {candidate.location}
                    </ItemTitle>
                  </ItemContent>
                  <ItemContent>
                    <ItemTitle
                      className={
                        isTopThree
                          ? "font-semibold text-neutral-900"
                          : "text-neutral-600"
                      }
                    >
                      {candidate.resume}
                    </ItemTitle>
                  </ItemContent>
                </div>
                {/* <ItemActions /> */}
              </Link>
            </Item>
          );
        })}
      </ItemGroup>
    </div>
  );
};

export default CandidateList;
