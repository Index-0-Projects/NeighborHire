"use client";

import { useState } from "react";
import Link from "next/link";

const MOCK_JOBS = [
  {
    id: "1",
    title: "Lawn mowing & yard cleanup",
    description:
      "Need someone to mow the front and back lawn, trim edges, and bag clippings. About 1/4 acre. One-time job, flexible on weekend.",
    location: "Oak Street, Downtown",
    jobType: "one-time",
    posted: "2 days ago",
  },
  {
    id: "2",
    title: "Dog walking — 3x per week",
    description:
      "Friendly golden retriever needs walks Mon/Wed/Fri around noon. 30–45 min. Prefer someone experienced with larger dogs.",
    location: "Maple Ave",
    jobType: "ongoing",
    posted: "1 day ago",
  },
  {
    id: "3",
    title: "Tutoring — math (grades 6–8)",
    description:
      "Looking for a patient tutor for my son, 2–3 sessions per week after school. Algebra and pre-algebra focus.",
    location: "Riverside",
    jobType: "part-time",
    posted: "3 days ago",
  },
  {
    id: "4",
    title: "Move furniture — one afternoon",
    description:
      "Help move a couch, bookshelf, and a few boxes from living room to basement. Stairs involved. Will provide refreshments.",
    location: "Cedar Lane",
    jobType: "one-time",
    posted: "5 hours ago",
  },
  {
    id: "5",
    title: "House sitting (2 weeks)",
    description:
      "Water plants, collect mail, take out trash. No pets. We’ll leave clear instructions and emergency contact.",
    location: "Pine Hill",
    jobType: "one-time",
    posted: "4 days ago",
  },
];

const JOB_TYPE_LABELS: Record<string, string> = {
  "one-time": "One-time",
  "part-time": "Part-time",
  "full-time": "Full-time",
  ongoing: "Ongoing",
};

export default function JobSearch() {
  const [search, setSearch] = useState("");
  const [locationFilter, setLocationFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");

  const filtered = MOCK_JOBS.filter((job) => {
    const matchSearch =
      !search ||
      job.title.toLowerCase().includes(search.toLowerCase()) ||
      job.description.toLowerCase().includes(search.toLowerCase());
    const matchLocation =
      !locationFilter ||
      job.location.toLowerCase().includes(locationFilter.toLowerCase());
    const matchType = !typeFilter || job.jobType === typeFilter;
    return matchSearch && matchLocation && matchType;
  });

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 px-4 py-12">
      <div className="mx-auto max-w-2xl">
        <Link
          href="/"
          className="mb-6 inline-block text-sm font-medium text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-50"
        >
          ← Back
        </Link>
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
          Search jobs
        </h1>
        <p className="mt-1 text-zinc-600 dark:text-zinc-400">
          Find help nearby — one-time tasks, part-time, or ongoing.
        </p>

        <div className="mt-8 space-y-4 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 shadow-sm">
          <div>
            <label
              htmlFor="search"
              className="block text-sm font-medium text-zinc-900 dark:text-zinc-50"
            >
              Keywords
            </label>
            <input
              id="search"
              type="text"
              placeholder="e.g. lawn, dog walking, tutoring"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="mt-1.5 w-full rounded-lg border border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-800 px-3 py-2 text-zinc-900 dark:text-zinc-50 placeholder:text-zinc-400 focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500"
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label
                htmlFor="location"
                className="block text-sm font-medium text-zinc-900 dark:text-zinc-50"
              >
                Location
              </label>
              <input
                id="location"
                type="text"
                placeholder="e.g. Oak Street"
                value={locationFilter}
                onChange={(e) => setLocationFilter(e.target.value)}
                className="mt-1.5 w-full rounded-lg border border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-800 px-3 py-2 text-zinc-900 dark:text-zinc-50 placeholder:text-zinc-400 focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500"
              />
            </div>
            <div>
              <label
                htmlFor="type"
                className="block text-sm font-medium text-zinc-900 dark:text-zinc-50"
              >
                Type
              </label>
              <select
                id="type"
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="mt-1.5 w-full rounded-lg border border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-800 px-3 py-2 text-zinc-900 dark:text-zinc-50 focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500"
              >
                <option value="">All types</option>
                <option value="one-time">One-time</option>
                <option value="part-time">Part-time</option>
                <option value="full-time">Full-time</option>
                <option value="ongoing">Ongoing</option>
              </select>
            </div>
          </div>
        </div>

        <div className="mt-8">
          <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
            {filtered.length} job{filtered.length !== 1 ? "s" : ""} found
          </p>
          <ul className="mt-4 space-y-4">
            {filtered.map((job) => (
              <li
                key={job.id}
                className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 shadow-sm transition-shadow hover:shadow-md"
              >
                <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                  <div className="min-w-0 flex-1">
                    <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
                      {job.title}
                    </h2>
                    <p className="mt-1 line-clamp-2 text-sm text-zinc-600 dark:text-zinc-400">
                      {job.description}
                    </p>
                    <div className="mt-3 flex flex-wrap gap-2 text-xs">
                      <span className="rounded-full bg-zinc-100 dark:bg-zinc-800 px-2.5 py-1 text-zinc-700 dark:text-zinc-300">
                        {JOB_TYPE_LABELS[job.jobType]}
                      </span>
                      <span className="text-zinc-500 dark:text-zinc-400">
                        {job.location}
                      </span>
                      <span className="text-zinc-400 dark:text-zinc-500">
                        · {job.posted}
                      </span>
                    </div>
                  </div>
                  <Link
                    href={`/jobsearch/${job.id}`}
                    className="mt-3 shrink-0 sm:mt-0 inline-flex h-10 items-center justify-center rounded-full bg-foreground px-4 text-sm font-medium text-background transition-colors hover:opacity-90"
                  >
                    View
                  </Link>
                </div>
              </li>
            ))}
          </ul>
          {filtered.length === 0 && (
            <p className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-8 text-center text-zinc-600 dark:text-zinc-400">
              No jobs match your filters. Try adjusting your search.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
