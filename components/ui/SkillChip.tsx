import type { SkillIconKey } from "@/lib/content";
import { SkillIcon } from "./SkillIcon";

// Compact chip: 18px icon + name. No levels, no bars, no descriptions (CLAUDE.md).
export function SkillChip({ name, icon }: { name: string; icon: SkillIconKey }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-border bg-bg-alt/60 px-3 py-1.5 font-mono text-[13px] text-text backdrop-blur-[10px] transition-colors hover:border-accent/40">
      <SkillIcon name={icon} className="size-[18px] shrink-0 text-accent-2" />
      {name}
    </span>
  );
}
