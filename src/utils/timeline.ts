import { professionalExperienceFull, extracurricularExperienceFull, type ExperienceEntry } from "../data/experience.js";

export interface TimelineEntry {
  id: string;
  type: "work" | "extracurricular";
  date: string;
  org: string;
  role: string;
  summary: string;
  bullets: string[];
}

function toTimelineEntry(
  entry: ExperienceEntry,
  type: TimelineEntry["type"],
  index: number
): TimelineEntry {
  const fallbackSummary = entry.bullets[0] ?? `${entry.organization} | ${entry.location}`;
  const rawId = `${type}-${index}-${entry.organization}-${entry.role}-${entry.timeframe}`;
  const normalizedId = rawId
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

  return {
    id: normalizedId,
    type,
    date: entry.timeframe,
    org: entry.organization,
    role: entry.role,
    summary: entry.summary ?? fallbackSummary,
    bullets: entry.bullets,
  };
}

function parseTimelineStart(dateLabel: string): number {
  const text = String(dateLabel);
  const monthMap: Record<string, number> = {
    jan: 0,
    feb: 1,
    mar: 2,
    apr: 3,
    may: 4,
    jun: 5,
    jul: 6,
    aug: 7,
    sep: 8,
    oct: 9,
    nov: 10,
    dec: 11,
  };

  const yearMatch = text.match(/\b(19|20)\d{2}\b/);
  if (!yearMatch) return Number.POSITIVE_INFINITY;

  const year = Number(yearMatch[0]);
  const monthMatch = text.match(/\b(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\b/i);

  let month = 0;
  if (monthMatch) {
    month = monthMap[monthMatch[0].slice(0, 3).toLowerCase()] ?? 0;
  } else if (/\bSummer\b/i.test(text)) {
    month = 5;
  } else if (/\bFall|Autumn\b/i.test(text)) {
    month = 8;
  } else if (/\bSpring\b/i.test(text)) {
    month = 2;
  } else if (/\bWinter\b/i.test(text)) {
    month = 0;
  }

  return year * 12 + month;
}

const raw: TimelineEntry[] = [
  ...professionalExperienceFull.map((entry, index) => toTimelineEntry(entry, "work", index)),
  ...extracurricularExperienceFull.map((entry, index) =>
    toTimelineEntry(entry, "extracurricular", index)
  ),
];

export const cvTimelineEntries: TimelineEntry[] = raw
  .map((entry, index) => ({ entry, index }))
  .sort((left, right) => {
    const diff = parseTimelineStart(left.entry.date) - parseTimelineStart(right.entry.date);
    return diff !== 0 ? diff : left.index - right.index;
  })
  .map(({ entry }) => entry);
