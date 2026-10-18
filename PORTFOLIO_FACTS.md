# Portfolio facts (source of truth)

All dates and metrics come from the latest resume (SDE version, Oct 2026).
Use this file when writing `lib/content.ts`. Do not invent or round numbers.
Items marked (confirm) are not on the resume; keep them only if you confirm.

## Identity
- Name: Harsh Vaibhav
- Role line: Full Stack + AI Engineer
- Location: Bengaluru, India
- Email: vaibhavharsh08@gmail.com
- GitHub: https://github.com/HarshVaibhav09
- LinkedIn: https://linkedin.com/in/harsh-vbhv
- Education: B.Tech, NIT Jalandhar, 2022 to 2026, CGPA 7.58/10 (do not mention branch)
- Status pill: Open to Full Stack + AI Engineer roles

## Hero stats
- 4 projects shipped
- 3 industry roles
- 850+ problems solved

## Experience
1. AI Automation Engineer, ERP BOSS, Remote, Feb 2026 to Apr 2026
   - 8-node multi-agent LangGraph workflow for email triage, classification and reply generation
   - RAG pipeline with Groq LLMs and Gemini embeddings, inboxes with 50+ unread threads
   - Model selection by latency, reasoning depth and cost: Groq for low-latency replies, Gemini for reasoning-heavy drafts
   - 80% reduction in end-to-end email handling workload
   - Honest framing: I owned the agent orchestration and RAG layer (the Gmail OAuth connection was built by a teammate)

2. Full Stack Developer Intern, DeepQ AI, In-office, Dec 2025 to Feb 2026
   - 15+ REST APIs with Django REST Framework (auth, employee management, workflow automation)
   - 5+ PostgreSQL schemas across 10+ tables
   - 10+ responsive React interfaces (dashboards, reporting, notifications), 4-member team, bi-weekly releases
   - JWT auth and role-based access control across 10+ endpoints

3. SDE Intern, Basil Infotech, Remote, Jun 2025 to Aug 2025
   - EduNexa school management system (React, Node.js, Express, MongoDB), 5-member team
   - Honest framing: I owned the backend (Node/Express REST APIs, RBAC + JWT, Redis caching, pagination, Postman testing)
   - Redis caching and pagination cut server load by 20% under concurrent traffic

## Projects (in display order)

### 1. OpsPilot (featured)
- One-liner: Document intelligence for logistics ops teams. Upload rate cards, SOPs and contracts, then ask questions instead of digging through PDFs.
- Stack: React, FastAPI, Python, ChromaDB, Groq, Docker
- Date: July 2026
- Metrics:
  - Sub-3-second p50 query latency, live
  - Hybrid search (dense embeddings + BM25 via reciprocal rank fusion): recall@5 0.74 to 0.84; exact-ID lookups 0.53 to 0.77 (50-query gold set)
  - Streaming chunking pipeline handles 80+ page PDFs at constant memory
  - Async background ingestion with real-time job-status tracking
  - Voice channel: streaming speech-to-text, silence-based endpointing, neural text-to-speech with multi-provider fallback
- Live: https://ops-pilot-phi.vercel.app
- Code: https://github.com/HarshVaibhav09/OpsPilot

### 2. MailWarden
- One-liner: A multi-agent system that runs a support inbox end to end, built during my work at ERP BOSS.
- Stack: LangGraph, LangChain, Groq, Gemini, Gmail API
- Metrics: 8-node LangGraph workflow, 50+ live threads, 80% less manual handling
- Design point: the proofreader is a separate agent (a model checking its own output approves almost anything); bounded rewrite loop escalates to a human when the retry budget runs out
- Live: none
- Code: https://github.com/HarshVaibhav09/MailWarden

### 3. BookWise
- One-liner: University library platform with a real borrow-request approval workflow.
- Stack: Next.js 15, TypeScript, Drizzle ORM, Neon Postgres, NextAuth, Upstash Redis
- Date: March 2025
- Highlights: approval flow as a state machine, rate-limited auth, ID-card verification, handling two users requesting the last copy at once
- Live: https://university-library-management-syste-nine.vercel.app/
- Code: https://github.com/HarshVaibhav09/BookWise

### 4. NyayaSetu (confirm details)
- One-liner: Ask questions about Indian law in plain English and get answers grounded in the actual statutes.
- Stack: Python, FastAPI, LangChain, Pinecone, Docker
- Date: May 2026
- Detail from GitHub (confirm): 282 legal PDFs, around 5,400 pages indexed for semantic search
- Live: none
- Code: https://github.com/HarshVaibhav09/NyayaSetu

## Skills (chips, no percentages)
- Languages: Python, C++, JavaScript, TypeScript, SQL
- AI / LLM: LangGraph, LangChain, RAG, multi-agent orchestration, prompt engineering, Groq, Gemini, RAGAS
- Backend: FastAPI, Node.js, Express, Django REST Framework, REST API design, Pydantic, OAuth 2.0, JWT
- Frontend: React, Next.js, Tailwind CSS
- Databases: PostgreSQL, MongoDB, SQLite, Redis, ChromaDB, Pinecone
- Cloud / DevOps: Docker, AWS, Git, GitHub, Linux, Vercel

## Achievements
- Smart India Hackathon 2025: national-level qualifier (100,000+ participants), representing NIT Jalandhar with an AI-powered solution
- 850+ problems solved across LeetCode, Codeforces and GeeksforGeeks
- AWS Certified Cloud Practitioner (confirm)

## Excluded on purpose
- Pre-Delinquency Risk Intelligence Platform: do not show anywhere on the site