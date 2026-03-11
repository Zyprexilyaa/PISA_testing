# PISA Thinking Skills — Project Documentation

**Last updated:** 2026-03-11

---

**Project summary**

- Name: PISA Thinking Skills (PISA app)
- Purpose: Web application for creating and practicing critical thinking test-style questions (propositions), managing classrooms, and tracking student progress. Teachers can create classrooms and propositions; students can join classrooms, practice propositions and submit answers.

---

**Contents**

- Overview & Goals
- Architecture & Components
- Tech stack & Dependencies
- Repository structure
- Local development: install & run
- Deployment: Firebase Hosting (frontend) + Render (backend) + Firestore rules
- Environment variables and secrets
- Firestore data model and security rules (summary)
- Backend API endpoints (payloads & examples)
- Frontend routes and pages
- Common issues, debugging & logs
- Testing checklist
- Next steps & TODOs

---

**Overview & Goals**

This project implements an educational web app focused on PISA-style thinking skills. Main goals:

- Allow teachers to create classrooms with join codes and add propositions (questions) with scoring rubrics.
- Allow students to sign up (email or Google), join classrooms, practice propositions, and submit answers for analysis.
- Use Firebase Auth for authentication and Firestore for persistence, with server-side Admin SDK endpoints where Firestore rules would otherwise block client operations (e.g., join by code).
- Provide a beautiful, mobile-friendly UI built with React + Vite + TypeScript.

---

**Architecture & Components**

- Frontend: React 18 + TypeScript + Vite. Uses Firebase Web SDK for Auth and client Firestore reads where permitted. Uses axios to call backend endpoints for server-side operations.
- Backend: Express.js (TypeScript) running on Render. Uses Firebase Admin SDK for privileged Firestore operations (join classroom, proposition management when required). Exposes several REST endpoints (e.g., `/joinClassroom`, `/propositions`, `/saveProposition`).
- Database: Firestore (collections: `users`, `classrooms`, `propositions`, `classroomSubmissions`, etc.) with security rules enforcing RBAC.
- Hosting: Frontend deployed to Firebase Hosting. Backend deployed to Render (auto-deploy from GitHub). Firestore rules deployed via Firebase CLI.

---

**Tech stack & Dependencies**

- Node.js (>=16 recommended)
- Frontend: React 18, Vite, TypeScript, Firebase JS SDK, axios
- Backend: Express, TypeScript, Firebase Admin SDK
- Optional: Google Cloud Speech / Gemini (used in some endpoints)

Key package files:
- `frontend/package.json` — frontend deps & scripts
- `backend/functions/package.json` — backend deps & scripts

---

**Repository structure (high level)**

- `frontend/` — React app (pages, components, services, contexts)
  - `src/pages` — page components (SignUpPage, GoogleProfileSetupPage, MainApp, PracticePage, Teacher pages, etc.)
  - `src/contexts` — `AuthContext.tsx`, `LanguageContext.tsx`
  - `src/services` — `classroomService.ts`, `propositionService.ts`, firebase init
- `backend/functions/` — Express backend (TypeScript)
  - `src/index.ts` — Express routes
  - `src/database.ts` — Admin SDK helpers (joinClassroomByKey, saveProposition, getPropositions)
  - `src/analyzeAnswer.ts`, `src/transcribeAudio.ts` — optional AI features
- `firestore.rules` — security rules
- `PROJECT_DOCUMENTATION.md` — this file
- `start-all.ps1` — helper script to run emulators/backends locally

---

**Local development: setup & run**

Prerequisites:
- Node.js installed
- Firebase CLI (`npm i -g firebase-tools`) if using emulators or deploying rules/hosting
- A Firebase project configured for the app (or use emulator for local dev)

Frontend (local):

```powershell
cd frontend
npm install
npm run dev
# open http://localhost:5173
```

Backend (local with emulator or service account):

```powershell
cd backend/functions
npm install
# Start backend (dev mode)
npm run dev
# or build & start
npm run build
npm start
```

Firebase emulator (optional):

```powershell
cd d:\Project CEDT
firebase emulators:start
```

There is a convenience script `start-all.ps1` that starts emulator, backend, and frontend concurrently.

---

**Deployment: Frontend & Backend**

Frontend (Firebase Hosting):

1. Build frontend: `cd frontend && npm run build`
2. Deploy hosting: `firebase deploy --only hosting`

Backend (Render.com):

1. Push backend changes to `master` on GitHub. Render is configured to auto-deploy.
2. Important: set environment variable `FIREBASE_SERVICE_ACCOUNT` to the JSON contents of your Firebase service account (Firebase Admin SDK service agent). In Render dashboard: `Environment` → Add `FIREBASE_SERVICE_ACCOUNT` with the JSON string. Restart the service after saving.
3. Ensure `PORT` env var matches Render provisioned port (the server uses provided `PORT`).

Firestore rules:

- Deploy via CLI: `firebase deploy --only firestore:rules`

---

**Environment variables**

Frontend (in `frontend/.env` or hosting config):
- `VITE_FIREBASE_API_KEY` (or similar) — Firebase Web API key
- `VITE_FIREBASE_AUTH_DOMAIN`
- `VITE_FIREBASE_PROJECT_ID`
- other `VITE_` prefixed Firebase config values used by `src/services/firebase`.

Backend (on Render environment):
- `FIREBASE_SERVICE_ACCOUNT` — full JSON of service account (stringified)
- `GCP_PROJECT_ID` (optional) — project ID used when initializing Admin SDK
- `PORT` — port for Express server (Render provides this automatically)
- Any API keys for external services (Gemini/Google Speech) stored as env vars

Security note: Never commit service account JSON or secrets to Git.

---

**Firestore data model (summary)**

- `users/{userId}`
  - email: string
  - role: 'teacher' | 'student'
  - username: string (after Google profile setup)
  - setupNeeded: boolean (true when Google signup needs profile completion)
  - createdAt: timestamp

- `classrooms/{classroomId}`
  - name, classKey (uppercase join code), teacherId, students: array of userIds
  - other metadata (createdAt, description)
  - subcollection: `members/{memberId}` with joinedAt

- `propositions/{propId}`
  - questionText, difficulty, category, expectedAnswer, scoringRubric, language, createdAt

- `classroomSubmissions/{submissionId}` (or nested under classroom)
  - studentId, answers, score, analysis, createdAt

Adjustments: check `backend/functions/src/database.ts` for exact fields.

---

**Firestore security rules (summary)**

- Students can only read public data and create their own member doc under `classrooms/{id}/members/{uid}` for joining patterns.
- Teachers can create & manage classrooms they own.
- Users can read/write their own `users/{uid}` doc.

See `firestore.rules` in the repo for exact rule set. Deploy with `firebase deploy --only firestore:rules`.

---

**Backend API endpoints (summary & payloads)**

- POST `/joinClassroom`
  - Body: `{ studentId: string, classKey: string }`
  - Response: `{ classroom: { id, ...fields } }`
  - Purpose: Use Admin SDK to find classroom by `classKey` and add student (bypasses client Firestore rule constraints).

- POST `/saveProposition`
  - Body: proposition fields `{ questionText, difficulty, category, expectedAnswer, scoringRubric, language }`
  - Response: `{ id: string, message }`

- GET `/propositions?language=th`
  - Response: `{ language, count, propositions: [...] }`

- POST `/analyzeAnswer` (AI analysis)
  - Body: `{ studentId, questionId, transcription, referenceAnswer }`
  - Response: analysis object (thinking level, score, feedback)

- POST `/transcribeAudio`
  - Body: `{ audioData: base64 }`
  - Response: `{ transcription }`

- GET `/userAnswerHistory?userId=...&limit=10`
  - Response: array of submissions

Check `backend/functions/src/index.ts` for full behavior and validation.

---

**Frontend routes & pages (summary)**

- `/signup` — `SignUpPage` (role selection, email signup, Google signup)
- `/login` — `LoginPage`
- `/setup-profile` — `GoogleProfileSetupPage` (username & role after Google signup)
- `/create-classroom` — Teacher page
- `/join-classroom` — Student join by code
- `/classroom/:classroomId` — Main classroom view (`MainApp`)
- `/teacher-dashboard/:classroomId` — Teacher analytics
- `/teacher/propositions` — Teacher propositions list
- `/teacher/propositions/new` — Create proposition
- `/practice` — Student practice page

Authorization: `ProtectedRoute` component enforces authentication and optional `allowedRoles`.

---

**Common issues, debugging & logs**

1. 500 errors on backend endpoints
   - Cause: backend cannot initialize Admin SDK (missing `FIREBASE_SERVICE_ACCOUNT`) or runtime error in endpoint.
   - Fix: ensure `FIREBASE_SERVICE_ACCOUNT` is set on Render and server restarted; check Render logs for `Firebase initialized with service account from env` and endpoint error messages.

2. Firestore permission errors when joining classroom from client
   - Cause: security rules prevent `where('classKey', '==', ...)` queries before user is a member.
   - Fix: client calls backend `/joinClassroom` which uses Admin SDK to add the user.

3. Google sign-up redirecting to home (skips profile setup)
   - Cause: race in auth state handling; fixed by reading `users/{uid}.setupNeeded` during `onAuthStateChanged` and forcing the setup page when needed.

4. CORS or Cross-Origin-Opener-Policy warnings
   - Usually benign; check browser console. Ensure backend sets required CORS headers (index.ts contains permissive CORS during dev).

Logs:
- Frontend: browser console
- Backend: Render Events/Logs
- Firebase: `firebase emulators:start` console or Firebase Console → Logs

---

**Testing checklist**

- [ ] Create teacher account (email) and create classroom
- [ ] Ensure classKey is created and visible
- [ ] Sign up with Google (new account) and confirm profile setup page appears
- [ ] As student, use `/joinClassroom` flow to join using the classKey
- [ ] Teacher creates proposition; student sees proposition in practice page
- [ ] Submit answer and verify analysis or submission record
- [ ] Verify Firestore documents are populated as expected

---

**Next steps & TODOs**

- Add end-to-end tests (Cypress or Playwright) for sign-up, join, proposition creation, and practice flows
- Add role-based UI improvements and clearer onboarding
- Implement proposition versioning and audit logs
- Improve chunking/splitting for Vite build to reduce large bundle warning
- Harden Firestore rules and add monitoring/alerts

---

If you'd like, I can also:

- Convert this into a nicely formatted `README.md` and commit it to the repository
- Generate step-by-step screenshots for setup
- Add a short `DEPLOY.md` with exact Render steps and screenshots


---

*End of documentation.*
