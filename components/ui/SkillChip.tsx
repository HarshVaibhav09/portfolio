import type { SkillIconKey } from "@/lib/content";
import { SkillIcon } from "./SkillIcon";

// Compact chip: 18px icon + name. No levels, no bars, no descriptions (CLAUDE.md).
// No backdrop blur (36 chips would each get their own GPU blur layer) and no hover state:
// a chip is not interactive, so it should not look clickable.
export function SkillChip({ name, icon }: { name: string; icon: SkillIconKey }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-border bg-bg-alt/60 px-3 py-1.5 font-mono text-[13px] text-text">
      <SkillIcon name={icon} className="size-[18px] shrink-0 text-accent-2" />
      {name}
    </span>
  );
}
