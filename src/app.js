import express from "express";
import helmet from "helmet";
import cors from "cors";
import morgan from "morgan";
import jobsRouter from "./routes/jobs.js";
import { notFoundHandler, errorHandler } from "./middlewares/error.js";

const app = express();

// Security & parsing
app.use(helmet());
app.use(cors());
app.use(express.json({ limit: "1mb" }));

// Logging
if (process.env.NODE_ENV !== "test") {
  app.use(morgan("dev"));
}

// API
app.use("/api/jobs", jobsRouter);

// 404 + centralized error handling
app.use(notFoundHandler);
app.use(errorHandler);

export default app;
