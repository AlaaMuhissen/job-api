import request from "supertest";
import app from "../src/app.js";
import { _reset } from "../src/store/jobStore.js";

beforeEach(() => _reset());

describe("Job API", () => {
  test("POST /api/jobs should validate required fields", async () => {
    const res = await request(app).post("/api/jobs").send({});
    expect(res.status).toBe(400);
    expect(res.body.error).toBe("Validation failed");
  });

  test("POST /api/jobs should create a job", async () => {
    const payload = {
      title: "React Intern",
      description: "Build UI features",
      company: "Acme",
      location: "Jerusalem"
    };
    const res = await request(app).post("/api/jobs").send(payload);
    expect(res.status).toBe(201);
    expect(res.body.id).toBeDefined();
    expect(res.body.title).toBe(payload.title);
  });

  test("GET /api/jobs should filter by title and location with pagination", async () => {
    // Seed
    const items = [
      { title: "React Intern", description: "x", company: "A", location: "Jerusalem" },
      { title: "Backend Intern", description: "y", company: "B", location: "Tel Aviv" },
      { title: "React Dev", description: "z", company: "C", location: "Haifa" }
    ];
    for (const it of items) {
      await request(app).post("/api/jobs").send(it);
    }

    // filter title=react
    let res = await request(app).get("/api/jobs").query({ title: "react" });
    expect(res.status).toBe(200);
    expect(res.body.items.length).toBe(2);
    expect(res.body.total).toBe(2);

    // filter location=Jerusalem
    res = await request(app).get("/api/jobs").query({ location: "Jerusalem" });
    expect(res.status).toBe(200);
    expect(res.body.items.length).toBe(1);
    expect(res.body.items[0].location).toMatch(/Jerusalem/i);

    // pagination
    res = await request(app).get("/api/jobs").query({ limit: 1, page: 2 });
    expect(res.status).toBe(200);
    expect(res.body.page).toBe(2);
    expect(res.body.items.length).toBe(1);
  });
});
