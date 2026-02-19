import { Link } from 'react-router';
import type { HistoryEntry } from '@/types';

function formatRelativeDate(timestamp: number): string {
  const now = Date.now();
  const diffMs = now - timestamp;
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return '今天';
  if (diffDays === 1) return '昨天';
  if (diffDays < 30) return `${diffDays} 天前`;

  const date = new Date(timestamp);
  return `${date.getMonth() + 1}/${date.getDate()}`;
}

export default function HistoryList({ history }: { history: HistoryEntry[] }) {
  return (
    <div className="rounded-xl border border-stone-200 bg-white p-4 shadow-sm">
      <h3 className="text-xl font-bold text-stone-900">最近瀏覽</h3>
      {history.length === 0 ? (
        <p className="mt-3 text-base text-stone-400">尚未瀏覽任何相簿。</p>
      ) : (
        <ul className="mt-3 space-y-1">
          {history.map(entry => (
            <li key={`${entry.shelf}-${entry.album}-${entry.timestamp}`}>
              <Link
                to={`/${encodeURIComponent(entry.shelf)}/${encodeURIComponent(entry.album)}`}
                className="block rounded px-2 py-1.5 text-base text-stone-700 hover:bg-stone-50"
              >
                <span className="text-stone-400">{entry.shelf} /</span> {entry.album}
                <span className="ml-2 text-sm text-stone-400">
                  {formatRelativeDate(entry.timestamp)}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
