import { Award, Code, Trophy, type LucideIcon } from "lucide-react";
import { cardClass } from "@/components/ui/card-styles";
import { Reveal } from "@/components/ui/Reveal";
import { achievements, achievementsHeading, type AchievementIconKey } from "@/lib/content";
import { cn } from "@/lib/utils";

const icons: Record<AchievementIconKey, LucideIcon> = {
  trophy: Trophy,
  code: Code,
  award: Award,
};

export function Achievements() {
  return (
    <div>
      <Reveal>
        <h3 className="font-mono text-sm uppercase tracking-widest text-accent">{achievementsHeading}</h3>
      </Reveal>
      <ul className="mt-6 grid gap-4 md:grid-cols-3">
        {achievements.map((achievement, i) => {
          const Icon = icons[achievement.icon];
          return (
            <li key={achievement.title}>
              <Reveal className="h-full" delay={i * 0.08}>
                <div className={cn(cardClass, "flex h-full items-start gap-4 p-5")}>
                  <span className="grid size-10 shrink-0 place-items-center rounded-full bg-accent/10 text-accent">
                    <Icon className="size-5" aria-hidden="true" />
                  </span>
                  <div>
                    <h4 className="font-semibold text-text">{achievement.title}</h4>
                    <p className="mt-1 text-sm text-muted">{achievement.detail}</p>
                  </div>
                </div>
              </Reveal>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
