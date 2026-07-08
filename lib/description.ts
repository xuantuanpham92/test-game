export interface DescriptionSection {
  title: string;
  body: string;
}

export function parseDescriptionSections(description: string): DescriptionSection[] {
  const trimmed = description.trim();
  if (!trimmed) return [];

  const matches = Array.from(trimmed.matchAll(/【([^】]+)】([\s\S]*?)(?=【[^】]+】|$)/g));

  if (matches.length === 0) {
    return [{ title: "详细分析", body: trimmed }];
  }

  const sections = matches
    .map((match) => ({
      title: match[1].trim(),
      body: match[2].trim(),
    }))
    .filter((section) => section.title && section.body);

  return sections.length > 0 ? sections : [{ title: "详细分析", body: trimmed }];
}
