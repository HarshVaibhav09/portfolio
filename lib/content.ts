// Single source of truth for all copy on the site.
// Every date, metric and link is copied from PORTFOLIO_FACTS.md. Do not round or invent.

/* ------------------------------------------------------------------
   Types
   ------------------------------------------------------------------ */

/** Keys mapped to lucide-react icons by UI components. */
export type UiIconKey =
  | "home"
  | "user"
  | "briefcase"
  | "code"
  | "clock"
  | "mail"
  | "map-pin"
  | "arrow-up";

/** Keys mapped to brand logos (react-icons/si) or lucide fallbacks by social link components. */
export type SocialIconKey = "github" | "linkedin" | "email";

/** Keys mapped to react-icons/si brand logos by SkillChip. Skills without a logo omit the key. */
export type SkillIconKey =
  | "python"
  | "cplusplus"
  | "javascript"
  | "typescript"
  | "langchain"
  | "langgraph"
  | "groq"
  | "gemini"
  | "fastapi"
  | "nodejs"
  | "express"
  | "django"
  | "pydantic"
  | "jwt"
  | "react"
  | "nextjs"
  | "tailwind"
  | "postgresql"
  | "mongodb"
  | "sqlite"
  | "redis"
  | "pinecone"
  | "docker"
  | "aws"
  | "git"
  | "github"
  | "linux"
  | "vercel";

export type SectionId = "home" | "about" | "work" | "skills" | "experience" | "contact";

export interface SocialLink {
  label: string;
  href: string;
  icon: SocialIconKey;
}

export interface Stat {
  value: string;
  label: string;
}

export interface Profile {
  name: string;
  role: string;
  location: string;
  email: string;
  education: string;
  cgpa: string;
  status: string;
  greeting: string;
  rotatingPrefix: string;
  rotatingWords: string[];
  description: string;
  photo: { src: string; alt: string };
  resume: string;
  socials: SocialLink[];
  stats: Stat[];
}

export interface Project {
  slug: string;
  name: string;
  oneLiner: string;
  stack: string[];
  date?: string;
  featured?: boolean;
  highlights: string[];
  links: { live?: string; code: string };
}

export interface Experience {
  role: string;
  company: string;
  mode: string;
  start: string;
  end: string;
  highlights: string[];
  /** Honest note on what I personally owned. */
  ownership?: string;
}

export interface Skill {
  name: string;
  icon?: SkillIconKey;
}

export interface SkillGroup {
  category: string;
  skills: Skill[];
}

export interface Achievement {
  title: string;
  detail: string;
}

export interface NavItem {
  id: SectionId;
  label: string;
  icon: UiIconKey;
}

export interface SectionHeader {
  label: string;
  title: string;
  description: string;
}

/* ------------------------------------------------------------------
   Site + navigation
   ------------------------------------------------------------------ */

export const site = {
  title: "Harsh Vaibhav | Full Stack + AI Engineer",
  description: "I build LLM systems and the full stack products around them.",
  logo: "HV",
} as const;

export const nav: NavItem[] = [
  { id: "home", label: "Home", icon: "home" },
  { id: "about", label: "About", icon: "user" },
  { id: "work", label: "Work", icon: "briefcase" },
  { id: "skills", label: "Skills", icon: "code" },
  { id: "experience", label: "Experience", icon: "clock" },
  { id: "contact", label: "Contact", icon: "mail" },
];

export const sections: Record<SectionId, SectionHeader> = {
  home: {
    label: "Home",
    title: "Hi, I'm Harsh Vaibhav",
    description: "Full Stack + AI Engineer based in Bengaluru.",
  },
  about: {
    label: "About",
    title: "About me",
    description: "Who I am and how I like to work.",
  },
  work: {
    label: "Work",
    title: "Selected projects",
    description: "Things I have built and shipped, with the numbers behind them.",
  },
  skills: {
    label: "Skills",
    title: "Tools I use",
    description: "The stack I reach for, grouped by where it fits.",
  },
  experience: {
    label: "Experience",
    title: "Where I have worked",
    description: "Industry roles and what I owned in each.",
  },
  contact: {
    label: "Contact",
    title: "Get in touch",
    description: "Have a role or a project in mind? Send me a message.",
  },
};

export const ui = {
  backToTop: "Back to top",
  logoLabel: "Harsh Vaibhav, back to top",
  navLabel: "Primary",
  menu: "Menu",
  switchToLight: "Switch to light theme",
  switchToDark: "Switch to dark theme",
} as const;

/* ------------------------------------------------------------------
   Profile
   ------------------------------------------------------------------ */

export const profile: Profile = {
  name: "Harsh Vaibhav",
  role: "Full Stack + AI Engineer",
  location: "Bengaluru, India",
  email: "vaibhavharsh08@gmail.com",
  education: "B.Tech, NIT Jalandhar, 2026",
  cgpa: "7.58/10",
  status: "Open to Full Stack + AI Engineer roles",
  greeting: "Hi, I'm",
  rotatingPrefix: "I build ",
  rotatingWords: ["RAG pipelines", "multi-agent systems", "FastAPI backends", "React frontends"],
  description: site.description,
  photo: { src: "/images/harsh.jpg", alt: "Portrait of Harsh Vaibhav" },
  resume: "/resume.pdf",
  socials: [
    { label: "GitHub", href: "https://github.com/HarshVaibhav09", icon: "github" },
    { label: "LinkedIn", href: "https://linkedin.com/in/harsh-vbhv", icon: "linkedin" },
    { label: "Email", href: "mailto:vaibhavharsh08@gmail.com", icon: "email" },
  ],
  stats: [
    { value: "4", label: "projects shipped" },
    { value: "3", label: "industry roles" },
    { value: "850+", label: "problems solved" },
  ],
};

/* ------------------------------------------------------------------
   Experience (most recent first)
   ------------------------------------------------------------------ */

export const experience: Experience[] = [
  {
    role: "AI Automation Engineer",
    company: "ERP BOSS",
    mode: "Remote",
    start: "Feb 2026",
    end: "Apr 2026",
    highlights: [
      "Built an 8-node multi-agent LangGraph workflow for email triage, classification and reply generation",
      "Built a RAG pipeline with Groq LLMs and Gemini embeddings over inboxes with 50+ unread threads",
      "Chose models by latency, reasoning depth and cost: Groq for low-latency replies, Gemini for reasoning-heavy drafts",
      "Cut end-to-end email handling workload by 80%",
    ],
    ownership:
      "I owned the agent orchestration and RAG layer. The Gmail OAuth connection was built by a teammate.",
  },
  {
    role: "Full Stack Developer Intern",
    company: "DeepQ AI",
    mode: "In-office",
    start: "Dec 2025",
    end: "Feb 2026",
    highlights: [
      "Built 15+ REST APIs with Django REST Framework for auth, employee management and workflow automation",
      "Designed 5+ PostgreSQL schemas across 10+ tables",
      "Built 10+ responsive React interfaces (dashboards, reporting, notifications) in a 4-member team with bi-weekly releases",
      "Implemented JWT auth and role-based access control across 10+ endpoints",
    ],
  },
  {
    role: "SDE Intern",
    company: "Basil Infotech",
    mode: "Remote",
    start: "Jun 2025",
    end: "Aug 2025",
    highlights: [
      "Worked on EduNexa, a school management system (React, Node.js, Express, MongoDB), in a 5-member team",
      "Built Node/Express REST APIs with RBAC + JWT, Redis caching, pagination and Postman testing",
      "Redis caching and pagination cut server load by 20% under concurrent traffic",
    ],
    ownership: "I owned the backend.",
  },
];

/* ------------------------------------------------------------------
   Projects (display order)
   ------------------------------------------------------------------ */

export const projects: Project[] = [
  {
    slug: "opspilot",
    name: "OpsPilot",
    oneLiner:
      "Document intelligence for logistics ops teams. Upload rate cards, SOPs and contracts, then ask questions instead of digging through PDFs.",
    stack: ["React", "FastAPI", "Python", "ChromaDB", "Groq", "Docker"],
    date: "July 2026",
    featured: true,
    highlights: [
      "Sub-3-second p50 query latency, live",
      "Hybrid search (dense embeddings + BM25 via reciprocal rank fusion): recall@5 0.74 to 0.84; exact-ID lookups 0.53 to 0.77 (50-query gold set)",
      "Streaming chunking pipeline handles 80+ page PDFs at constant memory",
      "Async background ingestion with real-time job-status tracking",
      "Voice channel: streaming speech-to-text, silence-based endpointing, neural text-to-speech with multi-provider fallback",
    ],
    links: {
      live: "https://ops-pilot-phi.vercel.app",
      code: "https://github.com/HarshVaibhav09/OpsPilot",
    },
  },
  {
    slug: "mailwarden",
    name: "MailWarden",
    oneLiner:
      "A multi-agent system that runs a support inbox end to end, built during my work at ERP BOSS.",
    stack: ["LangGraph", "LangChain", "Groq", "Gemini", "Gmail API"],
    highlights: [
      "8-node LangGraph workflow, 50+ live threads, 80% less manual handling",
      "The proofreader is a separate agent, because a model checking its own output approves almost anything",
      "Bounded rewrite loop escalates to a human when the retry budget runs out",
    ],
    links: { code: "https://github.com/HarshVaibhav09/MailWarden" },
  },
  {
    slug: "bookwise",
    name: "BookWise",
    oneLiner: "University library platform with a real borrow-request approval workflow.",
    stack: ["Next.js 15", "TypeScript", "Drizzle ORM", "Neon Postgres", "NextAuth", "Upstash Redis"],
    date: "March 2025",
    highlights: [
      "Approval flow modeled as a state machine",
      "Rate-limited auth and ID-card verification",
      "Handles two users requesting the last copy at once",
    ],
    links: {
      live: "https://university-library-management-syste-nine.vercel.app/",
      code: "https://github.com/HarshVaibhav09/BookWise",
    },
  },
  {
    slug: "nyayasetu",
    name: "NyayaSetu",
    oneLiner:
      "Ask questions about Indian law in plain English and get answers grounded in the actual statutes.",
    stack: ["Python", "FastAPI", "LangChain", "Pinecone", "Docker"],
    date: "May 2026",
    highlights: ["282 legal PDFs, around 5,400 pages indexed for semantic search"],
    links: { code: "https://github.com/HarshVaibhav09/NyayaSetu" },
  },
];

/* ------------------------------------------------------------------
   Skills (chips only, no levels)
   ------------------------------------------------------------------ */

export const skillGroups: SkillGroup[] = [
  {
    category: "AI / LLM",
    skills: [
      { name: "LangGraph", icon: "langgraph" },
      { name: "LangChain", icon: "langchain" },
      { name: "RAG" },
      { name: "Multi-agent orchestration" },
      { name: "Prompt engineering" },
      { name: "Groq", icon: "groq" },
      { name: "Gemini", icon: "gemini" },
      { name: "RAGAS" },
    ],
  },
  {
    category: "Backend",
    skills: [
      { name: "FastAPI", icon: "fastapi" },
      { name: "Node.js", icon: "nodejs" },
      { name: "Express", icon: "express" },
      { name: "Django REST Framework", icon: "django" },
      { name: "REST API design" },
      { name: "Pydantic", icon: "pydantic" },
      { name: "OAuth 2.0" },
      { name: "JWT", icon: "jwt" },
    ],
  },
  {
    category: "Frontend",
    skills: [
      { name: "React", icon: "react" },
      { name: "Next.js", icon: "nextjs" },
      { name: "Tailwind CSS", icon: "tailwind" },
    ],
  },
  {
    category: "Databases",
    skills: [
      { name: "PostgreSQL", icon: "postgresql" },
      { name: "MongoDB", icon: "mongodb" },
      { name: "SQLite", icon: "sqlite" },
      { name: "Redis", icon: "redis" },
      { name: "ChromaDB" },
      { name: "Pinecone", icon: "pinecone" },
    ],
  },
  {
    category: "Cloud / DevOps",
    skills: [
      { name: "Docker", icon: "docker" },
      { name: "AWS", icon: "aws" },
      { name: "Git", icon: "git" },
      { name: "GitHub", icon: "github" },
      { name: "Linux", icon: "linux" },
      { name: "Vercel", icon: "vercel" },
    ],
  },
  {
    category: "Languages",
    skills: [
      { name: "Python", icon: "python" },
      { name: "C++", icon: "cplusplus" },
      { name: "JavaScript", icon: "javascript" },
      { name: "TypeScript", icon: "typescript" },
      { name: "SQL" },
    ],
  },
];

/* ------------------------------------------------------------------
   Achievements
   ------------------------------------------------------------------ */

export const achievements: Achievement[] = [
  {
    title: "Smart India Hackathon 2025",
    detail:
      "National-level qualifier (100,000+ participants), representing NIT Jalandhar with an AI-powered solution",
  },
  {
    title: "850+ problems solved",
    detail: "Across LeetCode, Codeforces and GeeksforGeeks",
  },
  {
    title: "AWS Certified Cloud Practitioner",
    detail: "Amazon Web Services",
  },
];
