import { v4 as uuid } from "uuid";

// In-memory data store (resets on server restart)
const jobs = [];

/** Create new job */
export function createJob({ title, description, company = "", location = "" }) {
  const now = new Date().toISOString();
  const job = {
    id: uuid(),
    title,
    description,
    company,
    location,
    postedAt: now
  };
  jobs.unshift(job); // newest first
  return job;
}

/** Query jobs with simple filters + pagination */
export function findJobs({ title, location, page = 1, limit = 10 }) {
  let result = jobs;

  if (title) {
    const t = title.toLowerCase();
    result = result.filter((j) => j.title.toLowerCase().includes(t));
  }
  if (location) {
    const l = location.toLowerCase();
    result = result.filter((j) => (j.location || "").toLowerCase().includes(l));
  }

  const total = result.length;
  const start = (page - 1) * limit;
  const end = start + limit;

  return {
    page,
    limit,
    total,
    totalPages: Math.ceil(total / limit),
    items: result.slice(start, end)
  };
}

/** Get one by id (not required but helpful) */
export function getJob(id) {
  return jobs.find((j) => j.id === id) || null;
}

/** For tests */
export function _reset() {
  jobs.splice(0, jobs.length);
}
