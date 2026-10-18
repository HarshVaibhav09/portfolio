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

/**
 * Keys mapped to icons by SkillIcon: react-icons/si brand logos, plus generic lucide keys
 * (the last group) for skills with no brand logo.
 */
export type SkillIconKey =
  | "python"
  | "cplusplus"
  | "javascript"
  | "typescript"
  | "langchain"
  | "langgraph"
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
  | "docker"
  | "git"
  | "github"
  | "linux"
  | "vercel"
  // lucide fallbacks
  | "brain"
  | "workflow"
  | "sparkles"
  | "gauge"
  | "network"
  | "key-round"
  | "database"
  | "zap"
  | "cloud";

/** Keys mapped to lucide-react icons in the Achievements cards. */
export type AchievementIconKey = "trophy" | "code" | "award";

/** Keys mapped to lucide-react icons in the About facts card. */
export type FactIconKey = "graduation-cap" | "map-pin" | "target" | "award";

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
  /** Headline numbers, shown as stat blocks on the featured card. */
  metrics?: Stat[];
  highlights: string[];
  /** Honest framing of my role, shown on the card. */
  note?: string;
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
  icon: SkillIconKey;
}

export interface SkillGroup {
  category: string;
  skills: Skill[];
}

export interface Achievement {
  title: string;
  detail: string;
  icon: AchievementIconKey;
}

export interface Fact {
  label: string;
  value: string;
  icon: FactIconKey;
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
  /** Short name used in the page-title template and Open Graph siteName. */
  name: "Harsh Vaibhav",
  keywords: [
    "Harsh Vaibhav",
    "Full Stack Engineer",
    "AI Engineer",
    "RAG",
    "Multi-agent systems",
    "LangGraph",
    "FastAPI",
    "React",
    "Next.js",
    "Bengaluru",
  ],
  locale: "en_IN",
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
  skipToContent: "Skip to content",
  backToTop: "Back to top",
  /** Starts with the visible "HV" so voice-control users can say what they see (WCAG 2.5.3). */
  logoLabel: "HV, Harsh Vaibhav, back to top",
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
   Hero + About
   ------------------------------------------------------------------ */

export const hero = {
  cta: {
    work: "View work",
    resume: "Download resume",
    contact: "Contact",
  },
  scrollLabel: "Scroll to the about section",
} as const;

export const work = {
  featuredLabel: "Featured",
  live: "Live",
  code: "Code",
  liveAria: "Live demo of",
  codeAria: "Source code of",
  moreHeading: "More projects",
  stackLabel: "Tech stack",
} as const;

export const contact = {
  intro:
    "Hiring for a Full Stack or AI Engineer role, building something with LLMs, or curious about one of my projects? Send me a message and I will get back to you.",
  fields: {
    name: { label: "Name", placeholder: "Your name" },
    email: { label: "Email", placeholder: "you@company.com" },
    message: { label: "Message", placeholder: "What would you like to talk about?" },
  },
  honeypotLabel: "Leave this field empty",
  submit: "Send message",
  sending: "Sending...",
  success: "Thanks, your message is on its way. I will reply to the email you entered.",
  errors: {
    invalid: "Please fix the highlighted fields.",
    generic: "Something went wrong sending your message. Please try again, or email me directly.",
    unavailable: "The form is unavailable right now. Please email me directly instead.",
    /** {minutes} is replaced with the wait time. */
    rateLimited: "You have sent a few messages already. Please try again in {minutes} min, or email me directly.",
  },
  validation: {
    nameShort: "Please enter at least 2 characters.",
    nameLong: "Please keep your name under 80 characters.",
    email: "Please enter a valid email address.",
    messageShort: "Please write at least 10 characters.",
    messageLong: "Please keep your message under 2,000 characters.",
  },
  /** The notification email I receive for each message (lib/email/contact-email.ts). */
  notificationEmail: {
    from: "Harsh's Portfolio <onboarding@resend.dev>",
    /** {name} is replaced with the visitor's name. */
    subject: "New message from {name} via your portfolio",
    heading: "New portfolio message",
    labels: { name: "Name", email: "Email", message: "Message", received: "Received" },
  },
} as const;

export const footer = {
  tagline: "Full Stack + AI Engineer in Bengaluru, building LLM systems and the products around them.",
  builtWith: "Built with Next.js, React Three Fiber and Tailwind",
} as const;

const AWS_CERT = "AWS Certified Cloud Practitioner";

export const about: { paragraphs: string[]; factsTitle: string; facts: Fact[] } = {
  paragraphs: [
    "I'm a Full Stack + AI Engineer based in Bengaluru. Across three industry roles and four shipped projects, I have built things that run end to end: a document search tool for logistics teams, a multi-agent system that runs a support inbox, and a library platform with a real approval workflow.",
    "On the AI side I work with RAG pipelines and multi-agent workflows, mostly in Python with FastAPI, LangGraph and Groq or Gemini models. I like to measure them. OpsPilot's hybrid search moved recall@5 from 0.74 to 0.84 on a 50-query gold set. On the product side I build the React and Next.js frontends, and the REST APIs, auth and databases behind them.",
    "I'm looking for a Full Stack or AI Engineer role where I can own features end to end, from the data layer to the interface, on a team that measures what it builds. If that sounds like yours, I'd like to hear from you.",
  ],
  factsTitle: "Quick facts",
  facts: [
    { label: "Education", value: profile.education, icon: "graduation-cap" },
    { label: "Location", value: profile.location, icon: "map-pin" },
    { label: "Focus", value: "RAG, multi-agent systems, full stack web", icon: "target" },
    { label: "Certification", value: AWS_CERT, icon: "award" },
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
      "Built an 8-node multi-agent LangGraph workflow for email triage, classification and reply generation, cutting end-to-end email handling workload by 80%",
      "Built a RAG pipeline with Groq LLMs and Gemini embeddings over inboxes with 50+ unread threads",
      "Chose models by latency, reasoning depth and cost: Groq for low-latency replies, Gemini for reasoning-heavy drafts",
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
      "Built 15+ REST APIs with Django REST Framework for auth, employee management and workflow automation, with JWT auth and role-based access control across 10+ endpoints",
      "Designed 5+ PostgreSQL schemas across 10+ tables",
      "Built 10+ responsive React interfaces (dashboards, reporting, notifications) in a 4-member team with bi-weekly releases",
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
      "Redis caching and pagination cut server load by 20% under concurrent traffic",
    ],
    ownership:
      "I owned the backend: Node/Express REST APIs, RBAC + JWT, Redis caching, pagination and Postman testing.",
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
    metrics: [
      { value: "Sub-3s", label: "p50 query latency, live" },
      { value: "0.74 → 0.84", label: "recall@5 with hybrid search" },
      { value: "0.53 → 0.77", label: "exact-ID lookups" },
      { value: "80+", label: "page PDFs at constant memory" },
    ],
    highlights: [
      "Hybrid search combines dense embeddings with BM25 via reciprocal rank fusion, measured on a 50-query gold set",
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
    note: "I owned the agent orchestration and RAG layer. The Gmail OAuth connection was built by a teammate.",
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
      "Handles two users requesting the last copy at once",
      "Rate-limited auth and ID-card verification",
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
      { name: "RAG", icon: "brain" },
      { name: "Multi-agent orchestration", icon: "workflow" },
      { name: "Prompt engineering", icon: "sparkles" },
      { name: "Groq", icon: "zap" },
      { name: "Gemini", icon: "gemini" },
      { name: "RAGAS", icon: "gauge" },
    ],
  },
  {
    category: "Backend",
    skills: [
      { name: "FastAPI", icon: "fastapi" },
      { name: "Node.js", icon: "nodejs" },
      { name: "Express", icon: "express" },
      { name: "Django REST Framework", icon: "django" },
      { name: "REST API design", icon: "network" },
      { name: "Pydantic", icon: "pydantic" },
      { name: "OAuth 2.0", icon: "key-round" },
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
      { name: "ChromaDB", icon: "database" },
      { name: "Pinecone", icon: "database" },
    ],
  },
  {
    category: "Cloud / DevOps",
    skills: [
      { name: "Docker", icon: "docker" },
      { name: "AWS", icon: "cloud" },
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
      { name: "SQL", icon: "database" },
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
    icon: "trophy",
  },
  {
    title: "850+ problems solved",
    detail: "Across LeetCode, Codeforces and GeeksforGeeks",
    icon: "code",
  },
  {
    title: AWS_CERT,
    detail: "Amazon Web Services",
    icon: "award",
  },
];

export const achievementsHeading = "Achievements";
