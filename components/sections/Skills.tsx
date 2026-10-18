import { Reveal } from "@/components/ui/Reveal";
import { Section } from "@/components/ui/Section";
import { SkillChip } from "@/components/ui/SkillChip";
import { sections, skillGroups } from "@/lib/content";

export function Skills() {
  return (
    <Section id="skills" {...sections.skills}>
      <div className="grid gap-x-10 gap-y-10 md:grid-cols-2 lg:grid-cols-3">
        {skillGroups.map((group, i) => (
          <Reveal key={group.category} delay={(i % 3) * 0.08}>
            <h3 className="font-mono text-sm uppercase tracking-widest text-accent-2">{group.category}</h3>
            <ul className="mt-4 flex flex-wrap gap-2.5">
              {group.skills.map((skill) => (
                <li key={skill.name}>
                  <SkillChip name={skill.name} icon={skill.icon} />
                </li>
              ))}
            </ul>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
