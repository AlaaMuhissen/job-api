# Job API

A tiny Express service for posting and searching jobs.
In-memory store, input validation, consistent errors, and a few tests to keep it honest.

## Tech stack

* Node + Express
* Zod for validation
* Jest + Supertest for tests
* CORS + Helmet enabled by default

## Getting started

### Requirements

* Node 18 or newer (works on 20/22 as well)

### Install & run

```bash
cd job-api
npm install
npm run dev
```

The server starts on `http://localhost:4000`.

### Test

```bash
npm test
```

If you’re on Windows and Jest ever complains about ESM, this project already runs Jest with `--experimental-vm-modules`, so it should be fine. If not, make sure your root `package.json` has `"type": "module"`.

## API

### Create a job

`POST /api/jobs`

**Body**

```json
{
  "title": "React Intern",
  "description": "Build UI features for our dashboard.",
  "company": "Acme",
  "location": "Jerusalem"
}
```

Rules:

* `title` and `description` are required, non-empty strings
* `company` and `location` are optional

**Success (201)**

```json
{
  "id": "c3f9c0a9-3c0a-4bb1-9d9f-52f0a5d7a2b1",
  "title": "React Intern",
  "description": "Build UI features for our dashboard.",
  "company": "Acme",
  "location": "Jerusalem",
  "postedAt": "2025-08-27T12:34:56.789Z"
}
```

**Validation error (400)**

```json
{
  "error": "Validation failed",
  "details": {
    "formErrors": [],
    "fieldErrors": {
      "title": ["Job Title is required"],
      "description": ["Short Description is required"]
    }
  }
}
```

---

### Search / list jobs

`GET /api/jobs`

**Query params**

* `title` — filter by title substring (case-insensitive)
* `location` — filter by location substring (case-insensitive)
* `page` — default 1
* `limit` — default 10, max 100

**Example**

```
GET /api/jobs?title=react&location=jerusalem&page=1&limit=5
```

**Response**

```json
{
  "page": 1,
  "limit": 5,
  "total": 1,
  "totalPages": 1,
  "items": [
    {
      "id": "c3f9c0a9-3c0a-4bb1-9d9f-52f0a5d7a2b1",
      "title": "React Intern",
      "description": "Build UI features for our dashboard.",
      "company": "Acme",
      "location": "Jerusalem",
      "postedAt": "2025-08-27T12:34:56.789Z"
    }
  ]
}
```

> There’s also `GET /api/jobs/:id` in this repo. It’s not required by the assignment, but it’s handy. Feel free to remove it if you want only the strict spec.

## Curl quick start

### Git Bash / WSL (recommended)

```bash
curl -X POST http://localhost:4000/api/jobs \
  -H "Content-Type: application/json" \
  -d '{
    "title": "React Intern",
    "description": "Build UI features",
    "company": "Acme",
    "location": "Jerusalem"
  }'
```

```bash
curl "http://localhost:4000/api/jobs?title=react&location=jerusalem"
```

### Windows PowerShell

PowerShell is picky about quotes. Either escape everything:

```powershell
curl -Method POST http://localhost:4000/api/jobs `
  -Headers @{ "Content-Type" = "application/json" } `
  -Body "{
    ""title"": ""React Intern"",
    ""description"": ""Build UI features"",
    ""company"": ""Acme"",
    ""location"": ""Jerusalem""
  }"
```

or save the payload to a file (easier):

```powershell
@'
{
  "title": "React Intern",
  "description": "Build UI features",
  "company": "Acme",
  "location": "Jerusalem"
}
'@ | Out-File -Encoding utf8 job.json

curl -Method POST http://localhost:4000/api/jobs `
  -Headers @{ "Content-Type" = "application/json" } `
  -InFile ./job.json
```

## Project structure

```
job-api/
  server.js                 # boots the HTTP server
  src/
    app.js                  # express app, middleware, routes, error handling
    routes/
      jobs.js               # POST /api/jobs, GET /api/jobs, GET /api/jobs/:id
    schemas/
      jobSchemas.js         # Zod schemas for body and query
    middlewares/
      validate.js           # reusable validation middleware
      error.js              # 404 and centralized error handler
    store/
      jobStore.js           # in-memory data + filtering + pagination
    utils/
      ApiError.js           # tiny typed error helper
  tests/
    jobs.test.js            # basic coverage for validation, creation, listing
  jest.config.js
  package.json
```

## Design notes

* In-memory store on purpose: keeps the surface area tiny. Swapping to a DB later means replacing `store/jobStore.js`.
* Validation happens at the edge with Zod, so the rest of the code can assume well-formed input.
* Errors are consistent: `{ "error": string, "details"?: any }`.
* Logging is on in dev, off in tests. Security headers are enabled.

## Troubleshooting

* **Port already in use**
  Change the port via `PORT=5000 npm run dev` or stop the other process.

* **PowerShell keeps breaking my JSON**
  Use the file-based approach shown above, or run curl from Git Bash.

* **Jest “Cannot use import statement outside a module”**
  Ensure `"type": "module"` is in `package.json`. The test script already runs Jest with `--experimental-vm-modules`.

## License

Not specified for this exercise. Use as reference or extend it however you like.
