import React, { useEffect, useState } from "react";

import {
  ItemGroup,
  Item,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from "./ui/item";

import { Link, useSearchParams } from "react-router-dom";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
} from "./ui/pagination";

const JobList = ({ homepage = false }) => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [meta, setMeta] = useState({});
  const [searchParams, setSearchParams] = useSearchParams();
  const initialPage = homepage ? 1 : parseInt(searchParams.get("page")) || 1;
  const [page, setPage] = useState(initialPage);
  const [limit] = useState(10);

  useEffect(() => {
    let cancelled = false;

    const fetchJobs = async () => {
      setLoading(true);
      setError(null);
      try {
        const params = new URLSearchParams();
        if (homepage) {
          params.set("homepage", "true");
          // homepage always shows first page
          params.set("page", "1");
        } else {
          params.set("page", String(page));
          params.set("limit", String(limit));
        }

        const res = await fetch(`/api/jobs?${params.toString()}`);
        if (!res.ok) throw new Error(`Failed to fetch jobs (${res.status})`);
        const data = await res.json();
        if (!cancelled) {
          setJobs(data.jobs || []);
          setMeta(data.meta || {});
        }
      } catch (err) {
        if (!cancelled) setError(err.message || "Failed to load jobs");
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchJobs();

    return () => {
      cancelled = true;
    };
  }, [homepage, page, limit]);

  // Keep the `page` reflected in the URL search params so users can share / use back/forward
  useEffect(() => {
    // Do not add page param for homepage view
    const sp = new URLSearchParams(searchParams.toString());
    if (homepage) {
      if (sp.has("page")) {
        sp.delete("page");
        setSearchParams(sp, { replace: true });
      }
      return;
    }

    if (page === 1) {
      // canonicalize: omit page=1 from URL
      if (sp.has("page")) {
        sp.delete("page");
        setSearchParams(sp, { replace: true });
      }
    } else {
      sp.set("page", String(page));
      setSearchParams(sp, { replace: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, homepage]);

  // Update local page state when URL/search params change (back/forward/navigation)
  useEffect(() => {
    if (homepage) return;
    const spPage = parseInt(searchParams.get("page")) || 1;
    if (spPage !== page) setPage(spPage);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  return (
    <div className="flex w-full max-w-4xl flex-col gap-6">
      {loading && (
        <div className="text-sm text-neutral-500">Loading jobs...</div>
      )}
      {error && <div className="text-sm text-red-500">{error}</div>}

      <ItemGroup className={"gap-4"}>
        {jobs.length === 0 && !loading && (
          <div className="text-sm text-neutral-500">No jobs found.</div>
        )}

        {jobs.map((job) => (
          <Item key={job._id} asChild variant="outline">
            <Link to={`/jobs/${job._id}`}>
              <ItemMedia />
              <ItemContent>
                <ItemDescription className={"font-faustina text-2xl font-bold"}>
                  {job.title}
                </ItemDescription>
                <ItemTitle className="text-neutral-600">
                  {job.company}
                </ItemTitle>
              </ItemContent>
              <ItemContent className="items-center justify-center text-center">
                <ItemTitle className={"text-2xl font-semibold"}>
                  {Array.isArray(job.applications)
                    ? job.applications.length
                    : 0}
                </ItemTitle>
                <ItemDescription className={"text-xs text-neutral-500"}>
                  Resumes
                </ItemDescription>
              </ItemContent>
            </Link>
          </Item>
        ))}
      </ItemGroup>

      {/* Pagination controls - hide on homepage */}
      {!homepage && meta && meta.totalPages > 1 && (
        <Pagination className="pt-4">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                aria-disabled={page <= 1}
              />
            </PaginationItem>

            {Array.from({ length: meta.totalPages }).map((_, i) => {
              const pageNum = i + 1;
              // only render first, last, and a window around current page to avoid too many buttons
              const show =
                pageNum === 1 ||
                pageNum === meta.totalPages ||
                (pageNum >= page - 2 && pageNum <= page + 2);
              if (!show) {
                // insert ellipsis placeholder where appropriate
                // we'll show ellipsis only where a hidden gap exists
                return null;
              }
              return (
                <PaginationItem key={pageNum}>
                  <PaginationLink
                    isActive={pageNum === page}
                    onClick={() => setPage(pageNum)}
                  >
                    {pageNum}
                  </PaginationLink>
                </PaginationItem>
              );
            })}

            <PaginationItem>
              <PaginationNext
                onClick={() => setPage((p) => Math.min(meta.totalPages, p + 1))}
                aria-disabled={page >= meta.totalPages}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
};

export default JobList;
