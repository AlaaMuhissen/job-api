import { z } from "zod";

// Requirements say: title and description are required.
// Company & location are included in the interface, but you can keep them optional if desired.
// Here we’ll make all 4 presentable and trimmed, title & description required by spec.
export const JobCreateSchema = z.object({
  title: z.string().trim().min(1, "Job Title is required"),
  description: z.string().trim().min(1, "Short Description is required"),
  company: z.string().trim().optional().default(""),
  location: z.string().trim().optional().default("")
});

export const JobQuerySchema = z.object({
  title: z.string().trim().optional(),
  location: z.string().trim().optional(),
  page: z.coerce.number().int().positive().optional().default(1),
  limit: z.coerce.number().int().positive().max(100).optional().default(10)
});
