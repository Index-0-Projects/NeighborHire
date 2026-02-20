"use client";

import { useState } from "react";
import Link from "next/link";

export default function UpdatePost() {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    location: "",
    jobType: "one-time",
    contact: "",
  });

  function handleChange(
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    // TODO: send update to API
    console.log("Updated job posting:", formData);
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 px-4 py-16">
        <div className="mx-auto max-w-xl rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-8 text-center shadow-sm">
          <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50">
            Job updated
          </h2>
          <p className="mt-2 text-zinc-600 dark:text-zinc-400">
            Your listing has been updated on the community board.
          </p>
          <Link
            href="/"
            className="mt-6 inline-flex h-11 items-center justify-center rounded-full bg-foreground px-5 text-background transition-colors hover:opacity-90"
          >
            Back to home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 px-4 py-12">
      <div className="mx-auto max-w-xl">
        <Link
          href="/"
          className="mb-6 inline-block text-sm font-medium text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-50"
        >
          ← Back
        </Link>
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
          Edit job
        </h1>
        <p className="mt-1 text-zinc-600 dark:text-zinc-400">
          Update the details for this job or task.
        </p>

        <form
          onSubmit={handleSubmit}
          className="mt-8 space-y-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 shadow-sm sm:p-8"
        >
          <div>
            <label
              htmlFor="title"
              className="block text-sm font-medium text-zinc-900 dark:text-zinc-50"
            >
              Job title
            </label>
            <input
              id="title"
              name="title"
              type="text"
              required
              placeholder="e.g. Lawn mowing, Dog walking"
              value={formData.title}
              onChange={handleChange}
              className="mt-1.5 w-full rounded-lg border border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-800 px-3 py-2 text-zinc-900 dark:text-zinc-50 placeholder:text-zinc-400 focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500"
            />
          </div>

          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium text-zinc-900 dark:text-zinc-50"
            >
              Description
            </label>
            <textarea
              id="description"
              name="description"
              required
              rows={4}
              placeholder="What do you need done? Include details like schedule, duration, and any requirements."
              value={formData.description}
              onChange={handleChange}
              className="mt-1.5 w-full rounded-lg border border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-800 px-3 py-2 text-zinc-900 dark:text-zinc-50 placeholder:text-zinc-400 focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500 resize-y min-h-[100px]"
            />
          </div>

          <div>
            <label
              htmlFor="location"
              className="block text-sm font-medium text-zinc-900 dark:text-zinc-50"
            >
              Location / neighborhood
            </label>
            <input
              id="location"
              name="location"
              type="text"
              placeholder="e.g. Oak Street, Downtown"
              value={formData.location}
              onChange={handleChange}
              className="mt-1.5 w-full rounded-lg border border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-800 px-3 py-2 text-zinc-900 dark:text-zinc-50 placeholder:text-zinc-400 focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500"
            />
          </div>

          <div>
            <label
              htmlFor="jobType"
              className="block text-sm font-medium text-zinc-900 dark:text-zinc-50"
            >
              Type
            </label>
            <select
              id="jobType"
              name="jobType"
              value={formData.jobType}
              onChange={handleChange}
              className="mt-1.5 w-full rounded-lg border border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-800 px-3 py-2 text-zinc-900 dark:text-zinc-50 focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500"
            >
              <option value="one-time">One-time</option>
              <option value="part-time">Part-time</option>
              <option value="full-time">Full-time</option>
              <option value="ongoing">Ongoing</option>
            </select>
          </div>

          <div>
            <label
              htmlFor="contact"
              className="block text-sm font-medium text-zinc-900 dark:text-zinc-50"
            >
              Contact (email or phone) - TBD
            </label>
            {/* <input
              id="contact"
              name="contact"
              type="text"
              required
              placeholder="email@example.com or (555) 123-4567"
              value={formData.contact}
              onChange={handleChange}
              className="mt-1.5 w-full rounded-lg border border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-800 px-3 py-2 text-zinc-900 dark:text-zinc-50 placeholder:text-zinc-400 focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500"
            /> */}
          </div>

          <button
            type="submit"
            className="w-full rounded-full bg-foreground py-3 px-5 font-medium text-background transition-colors hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-zinc-500 focus:ring-offset-2 dark:focus:ring-offset-zinc-900"
          >
            Update job
          </button>
        </form>
      </div>
    </div>
  );
}
