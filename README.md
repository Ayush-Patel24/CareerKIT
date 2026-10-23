# CareerKit — AI Resume Builder & Career Assistant

[![Vite](https://img.shields.io/badge/Vite-8.x-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![React](https://img.shields.io/badge/React-19.x-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![Express](https://img.shields.io/badge/Express-4.x-000000?logo=express&logoColor=white)](https://expressjs.com/)
[![Supabase](https://img.shields.io/badge/Supabase-Auth%20%26%20Postgres-3ECF8E?logo=supabase&logoColor=white)](https://supabase.com/)
[![Gemini](https://img.shields.io/badge/Google%20Gemini-AI%20Engine-4285F4?logo=google&logoColor=white)](https://ai.google.dev/)

**CareerKit** is a full-stack, production-oriented web application designed to help students, fresh graduates, and experienced job seekers create ATS-compliant resumes, explore recruiter-vetted templates, run objective AI diagnostics, and export pixel-crisp A4 PDFs — completely free, with no paywalls or hidden subscriptions.

---

## 🌟 Key Features

- **Multi-Section Resume Editor**: Seamlessly manage Personal Information, Professional Summary, Work Experience, Education, Technical & Soft Skills, Projects, Certifications, Achievements, and Languages.
- **4 Recruiter-Vetted Templates**:
  1. **ATS Classic**: High-parsing single-column linear layout designed for 100% compliance with corporate ATS algorithms (Workday, Taleo, Greenhouse).
  2. **Executive Professional**: Left-accented headings, structured competency blocks, and clear chronological flow for senior candidates.
  3. **Modern Asymmetric**: Contemporary 2-column layout with a visual profile monogram, skill pill badges, and sidebar contact cards.
  4. **Compact One-Page**: Space-optimized format engineered for college graduates, students, or dense 1-page resumes.
- **AI Resume Diagnostics (Gemini API)**:
  - Overall ATS compatibility estimate (0–100) with honest scoring methodology.
  - Category breakdown: Impact & Metrics, ATS Readability, Action Verbs, and Technical Skills.
  - Identification of underrepresented keywords and formatting suggestions.
  - Target Job Description matching (finds exact keyword matches and critical missing requirements).
- **AI Writing Assistant (STAR Method)**:
  - Generates tailored professional summaries with user review and approval.
  - Rewrites weak bullet points into high-impact accomplishments using the STAR framework (*Situation, Task, Action, Result*).
  - Strictly prevents AI hallucinations — AI never fabricates fake qualifications or companies.
- **Document Text Extractor**: Upload PDF, DOCX, or TXT files directly to extract resume text for instant AI analysis.
- **High-Resolution A4 PDF Export**: One-click download utility that generates crisp A4 PDFs without clipped text, plus browser native print preview integration.
- **Hybrid Persistence & Security**:
  - Offline-first local storage draft recovery ensures no work is lost if disconnected.
  - Supabase Auth & PostgreSQL sync with strict **Row Level Security (RLS)** ensuring users only access their own private resumes and analyses.

---

## 📐 Design System

CareerKit follows an **ultra-minimal, premium black-and-white SaaS aesthetic**:
- **Background**: Off-white and white (`#FFFFFF`, `#FAFAFA`).
- **Typography**: Clean, high-contrast black headers and secondary grey body text.
- **Borders & Dividers**: Subtle borders (`#E4E4E7`) with restrained corner rounding (`6px` / `8px`).
- **Icons**: Minimalist line icons from `lucide-react`.
- **Accessibility**: High-contrast ratios, visible focus indicators (`:focus-visible`), and semantic HTML.

---

## 🏗️ Architecture & Technology Stack

```
CareerKit/
├── client/                     # Frontend Application (React + Vite)
│   ├── src/
│   │   ├── components/         # Reusable UI, Layout, & Builder form sections
│   │   ├── context/            # AuthContext, ResumeContext, ToastContext
│   │   ├── lib/                # Supabase client, API client, PDF exporter
│   │   ├── pages/              # Landing, Dashboard, Builder, Analyzer, etc.
│   │   ├── styles/             # Variables, global tokens, and resets
│   │   └── templates/          # 4 distinct resume templates (Classic, Prof, Modern, Compact)
│   ├── package.json
│   └── vite.config.js
│
├── server/                     # Backend API (Node.js + Express)
│   ├── src/
│   │   ├── config/             # Environment & Gemini client configuration
│   │   ├── controllers/        # AI & Document parsing controllers
│   │   ├── middleware/         # Uploads, rate limiting, centralized error handling
│   │   ├── routes/             # REST API endpoints (/api/ai, /api/parse, /api/health)
│   │   ├── services/           # Gemini AI service & Document parser (PDF/DOCX)
│   │   └── server.js           # Server entry point
│   └── package.json
│
├── supabase/
│   └── migrations/
│       └── 01_init_schema.sql  # PostgreSQL tables, triggers, and RLS policies
│
├── .env.example                # Unified environment variables template
└── README.md                   # Full documentation
```

---

## 🚀 Getting Started (Step-by-Step for Beginners)

### 1. Prerequisites

Ensure you have **Node.js** (v18 or higher) installed on your system.
Verify in your terminal:
```bash
node -v
npm -v
```

### 2. Clone and Setup Environment Files

Copy the provided `.env.example` templates to `.env` files:

#### Client Configuration:
Create `client/.env`:
```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
VITE_API_URL=http://localhost:5000/api
```
*(Note: If you do not have Supabase keys yet, leave them blank. The app will automatically run in local browser storage mode so you can test all features immediately!)*

#### Server Configuration:
Create `server/.env`:
```env
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:5173
GEMINI_API_KEY=your-gemini-api-key-here
GEMINI_MODEL=gemini-2.5-flash
```

> **How to get a free Gemini API Key**:
> 1. Visit [Google AI Studio](https://aistudio.google.com/).
> 2. Sign in with your Google account.
> 3. Click **"Get API key"** and create a key.
> 4. Paste it into `server/.env` as `GEMINI_API_KEY=your_key`.

---

### 3. Setting Up the Database (Supabase)

1. Create a free project at [Supabase](https://supabase.com).
2. In the Supabase Dashboard, go to the **SQL Editor**.
3. Open `supabase/migrations/01_init_schema.sql` from this repository.
4. Copy its contents, paste them into the Supabase SQL Editor, and click **Run**.
5. This automatically configures:
   - `profiles` table with auto-insert trigger on user signup.
   - `resumes` table with JSONB document storage.
   - `analyses` table with score and keyword storage.
   - Strict **Row Level Security (RLS)** ensuring users only read, write, or delete their own documents.
6. Retrieve your **Project URL** and **Anon Public Key** from **Settings -> API** and add them to `client/.env`.

---

### 4. Running the Application Locally

You can run both client and server from the root directory or in separate terminal windows.

#### Option A: Running from Root
Terminal 1 (Backend Server):
```bash
npm run server:dev
```
Terminal 2 (Frontend Client):
```bash
npm run client:dev
```

#### Option B: Running in Individual Folders
Terminal 1:
```bash
cd server
npm start
```
Terminal 2:
```bash
cd client
npm run dev
```

Open your browser to:
**http://localhost:5173**

---

## 🧪 Verification & Testing Guide

| Feature | How to Verify |
|---|---|
| **Resume Builder** | Navigate to `/builder`. Edit Personal Info, Experience, and Skills. Notice live sync in the A4 preview. |
| **Template Switching** | Select *ATS Classic*, *Executive Professional*, *Modern Asymmetric*, or *Compact One-Page*. Observe layout adapt in real time. |
| **PDF Download** | In the Builder, click **Download PDF**. A high-resolution A4 document will generate and download. |
| **Document Text Extraction** | Navigate to `/analyzer`. Upload any `.pdf`, `.docx`, or `.txt` resume. The text is parsed server-side and displayed in the editor. |
| **AI Resume Analysis** | In the Analyzer, click **Analyze Resume**. Gemini evaluates category scores, strengths, weaknesses, and missing keywords. |
| **AI Bullet Improver** | In the Builder under *Work Experience*, click **Polish Bullets with AI**. Review the STAR suggestions and click *Apply*. |
| **AI Summary Improver** | In the Builder under *Summary*, click **Improve with AI**. Review variations and choose one to apply. |
| **Persistence & Autosave** | Refresh the browser. Local draft recovery automatically restores all your edits. |
| **Account Management** | Navigate to `/settings` to manage display name, password updates, and JSON data exports. |

---

## 🔒 Security & Privacy Best Practices

- **Zero Client-Side Secrets**: All Gemini AI interactions occur on the Express backend (`server/src/services/geminiService.js`). `GEMINI_API_KEY` is never exposed to browser code.
- **Row Level Security (RLS)**: PostgreSQL enforces that users cannot query or tamper with other users' resumes.
- **In-Memory File Processing**: Uploaded documents are parsed in memory using `multer` memory storage; files are never stored unencrypted on server disk.
- **Input Validation & Sanitization**: Text inputs have character limits (max 50,000 characters) and rate limiting (40 requests per 15 minutes) to protect against denial of service and API quota drain.

---

## 🚢 Deployment Guide

### Deploying Frontend (Vercel)
1. Push your code to GitHub.
2. Import the project into [Vercel](https://vercel.com).
3. Set the **Root Directory** to `client`.
4. Add environment variables in Vercel:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
   - `VITE_API_URL` (points to your deployed backend URL, e.g. `https://your-api.onrender.com/api`)
5. Click **Deploy**.

### Deploying Backend (Render / Railway / Fly.io)
1. Set the **Root Directory** to `server`.
2. Build command: `npm install`
3. Start command: `node src/server.js`
4. Add environment variables:
   - `PORT=5000`
   - `NODE_ENV=production`
   - `CLIENT_URL=https://your-careerkit-site.vercel.app`
   - `GEMINI_API_KEY=your_gemini_api_key`
   - `GEMINI_MODEL=gemini-2.5-flash`
5. Click **Deploy**.

---

## 📄 License

This project is licensed under the MIT License — free for personal and commercial use.
