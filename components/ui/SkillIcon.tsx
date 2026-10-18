import type { ComponentType } from "react";
import {
  Brain,
  Cloud,
  Database,
  Gauge,
  KeyRound,
  Network,
  Sparkles,
  Workflow,
  Zap,
} from "lucide-react";
import {
  SiCplusplus,
  SiDjango,
  SiDocker,
  SiExpress,
  SiFastapi,
  SiGit,
  SiGithub,
  SiGooglegemini,
  SiJavascript,
  SiJsonwebtokens,
  SiLangchain,
  SiLanggraph,
  SiLinux,
  SiMongodb,
  SiNextdotjs,
  SiNodedotjs,
  SiPostgresql,
  SiPydantic,
  SiPython,
  SiReact,
  SiRedis,
  SiSqlite,
  SiTailwindcss,
  SiTypescript,
  SiVercel,
} from "react-icons/si";
import type { SkillIconKey } from "@/lib/content";

type IconComponent = ComponentType<{ className?: string; "aria-hidden"?: "true" }>;

// Brand logos from react-icons/si. The si set has no Groq, Pinecone, ChromaDB or AWS logo,
// and some skills (RAG, OAuth...) have none at all, so those use lucide icons instead.
const icons: Record<SkillIconKey, IconComponent> = {
  python: SiPython,
  cplusplus: SiCplusplus,
  javascript: SiJavascript,
  typescript: SiTypescript,
  langchain: SiLangchain,
  langgraph: SiLanggraph,
  gemini: SiGooglegemini,
  fastapi: SiFastapi,
  nodejs: SiNodedotjs,
  express: SiExpress,
  django: SiDjango,
  pydantic: SiPydantic,
  jwt: SiJsonwebtokens,
  react: SiReact,
  nextjs: SiNextdotjs,
  tailwind: SiTailwindcss,
  postgresql: SiPostgresql,
  mongodb: SiMongodb,
  sqlite: SiSqlite,
  redis: SiRedis,
  docker: SiDocker,
  git: SiGit,
  github: SiGithub,
  linux: SiLinux,
  vercel: SiVercel,
  brain: Brain,
  workflow: Workflow,
  sparkles: Sparkles,
  gauge: Gauge,
  network: Network,
  "key-round": KeyRound,
  database: Database,
  zap: Zap,
  cloud: Cloud,
};

export function SkillIcon({ name, className }: { name: SkillIconKey; className?: string }) {
  const Icon = icons[name];
  return <Icon className={className} aria-hidden="true" />;
}
