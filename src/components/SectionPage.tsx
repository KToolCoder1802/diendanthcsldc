import { Feed } from "./Feed";
import { SECTIONS, type Section } from "@/lib/forum";

export function SectionPage({ section }: { section: Section }) {
  const s = SECTIONS[section];
  return (
    <div className="space-y-4">
      <div className="rounded-xl bg-gradient-to-r from-primary to-flame p-4 text-primary-foreground shadow">
        <h1 className="text-xl font-extrabold">{s.emoji} {s.title}</h1>
        <p className="text-sm opacity-90">{s.desc}</p>
      </div>
      <Feed section={section} />
    </div>
  );
}
