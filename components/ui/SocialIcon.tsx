import type { IconType } from "react-icons";
import { FaLinkedin } from "react-icons/fa6";
import { SiGithub } from "react-icons/si";
import { Mail } from "lucide-react";
import type { SocialIconKey } from "@/lib/content";

// lucide v1 dropped brand logos, so GitHub and LinkedIn come from react-icons
// (the si set has no LinkedIn, hence fa6).
const icons: Record<SocialIconKey, IconType> = {
  github: SiGithub,
  linkedin: FaLinkedin,
  email: Mail,
};

export function SocialIcon({ name, className }: { name: SocialIconKey; className?: string }) {
  const Icon = icons[name];
  return <Icon className={className} aria-hidden="true" />;
}
