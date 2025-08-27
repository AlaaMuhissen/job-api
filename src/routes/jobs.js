import { Router } from "express";
import ApiError from "../utils/ApiError.js";
import { validateBody } from "../middlewares/validate.js";
import { JobCreateSchema, JobQuerySchema } from "../schemas/jobSchemas.js";
import { createJob, findJobs, getJob } from "../store/jobStore.js";

const router = Router();

// POST /api/jobs — create job (with validation & robust errors)
router.post("/", validateBody(JobCreateSchema), (req, res, next) => {
  try {
    const job = createJob(req.validated);
    res.status(201).json(job);
  } catch (e) {
    next(new ApiError(500, "Failed to create job"));
  }
});

// GET /api/jobs — list with filters & pagination (title, location)
router.get("/", (req, res, next) => {
  try {
    const parsed = JobQuerySchema.safeParse(req.query);
    if (!parsed.success) {
      return next(
        new ApiError(400, "Invalid query parameters", parsed.error.flatten())
      );
    }
    const data = findJobs(parsed.data);
    res.json(data);
  } catch (e) {
    next(new ApiError(500, "Failed to fetch jobs"));
  }
});

// GET /api/jobs/:id — single job
router.get("/:id", (req, res, next) => {
  try {
    const job = getJob(req.params.id);
    if (!job) return next(new ApiError(404, "Job not found"));
    res.json(job);
  } catch {
    next(new ApiError(500, "Failed to fetch job"));
  }
});

export default router;
