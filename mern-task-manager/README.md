# MERN Task Manager + AI Task Summary

A full-stack task manager built with MongoDB, Express, React, Node.js, Axios, JWT, bcrypt, and an AI-summary service abstraction.

## Features
- Register and login with validation
- Password hashing with bcrypt
- JWT authentication and protected task routes
- User-owned task CRUD (create, list, update, delete)
- React Router protected dashboard
- Axios client with auth token interceptor
- AI **Generate Task Summary** button with loading/error states
- Mock summary works by default; optional Gemini API support
- MVC-style backend structure and environment variables

## Requirements
- Node.js 18+
- MongoDB local instance or MongoDB Atlas connection string
- npm

## 1. Configure backend
```bash
cd backend
copy .env.example .env
npm install
```
Edit `backend/.env` and set `MONGO_URI`, `JWT_SECRET`, and (optionally) `GEMINI_API_KEY`.
On macOS/Linux use `cp .env.example .env` instead of `copy`.

## 2. Run backend
```bash
cd backend
npm run dev
```
API defaults to `http://localhost:5000`. Health check: `GET /api/health`.

## 3. Run frontend
Open a second terminal:
```bash
cd frontend
npm install
copy .env.example .env
npm run dev
```
Open the Vite URL shown, usually `http://localhost:5173`.

## API overview
All protected endpoints require `Authorization: Bearer <token>`.

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/register` | Create account |
| POST | `/api/auth/login` | Login and receive JWT |
| GET | `/api/auth/me` | Current authenticated user |
| GET | `/api/tasks` | List current user's tasks |
| POST | `/api/tasks` | Create task |
| GET | `/api/tasks/:id` | Get one task |
| PUT | `/api/tasks/:id` | Update task |
| DELETE | `/api/tasks/:id` | Delete task |
| POST | `/api/ai/summarize` | Summarize a task description |
| GET | `/api/health` | Health check |

### Example task
```json
{
  "title": "Prepare interview",
  "description": "Review JavaScript, React, APIs, authentication, and practice coding questions.",
  "status": "pending",
  "priority": "medium"
}
```

## AI summary configuration
The default `AI_PROVIDER=mock` uses a deterministic local mock so the app runs without an API key. To use Gemini:
1. Set `AI_PROVIDER=gemini` and `GEMINI_API_KEY` in `backend/.env`.
2. Restart the backend.
3. Do not put provider API keys in the React `.env` or commit them.

## Security notes
- Passwords are hashed using bcrypt; plaintext passwords are never stored.
- JWT secret is read from `.env`.
- This learning project stores the JWT in `localStorage` and sends it as a Bearer token. For production, prefer secure, httpOnly, sameSite cookies with CSRF protections and appropriate deployment configuration.
- Never commit `.env` files or API keys.
- Task queries are scoped to the authenticated user.

## Suggested interview walkthrough (2–3 minutes)
1. Explain the React pages and protected route.
2. Show registration/login and point out bcrypt + JWT.
3. Create, edit, complete, and delete a task.
4. Click **Generate summary** and explain the separate AI service, loading state, and error handling.
5. Explain that task endpoints only access the logged-in user's records.

## Git submission
Create a repository, then from the project root:
```bash
git init
git add .
git commit -m "Build MERN task manager with AI summaries"
git branch -M main
git remote add origin YOUR_GITHUB_REPOSITORY_URL
git push -u origin main
```
