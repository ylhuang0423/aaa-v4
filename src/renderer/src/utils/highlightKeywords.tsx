import type { ReactNode } from 'react';

function escapeRegExp(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

export default function highlightKeywords(text: string, keywords: string[]): ReactNode {
  if (keywords.length === 0) return text;

  const pattern = keywords.map(escapeRegExp).join('|');
  const regex = new RegExp(`(${pattern})`, 'g');
  const parts = text.split(regex);

  if (parts.length === 1) return text;

  return parts.map((part, i) =>
    regex.test(part) ? (
      <mark key={i} className="rounded-sm bg-amber-200 text-inherit">
        {part}
      </mark>
    ) : (
      part
    ),
  );
}
