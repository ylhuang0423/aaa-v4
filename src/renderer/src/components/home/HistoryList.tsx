import { Link } from 'react-router';
import type { HistoryEntry } from '@/types';

export default function HistoryList({ history }: { history: HistoryEntry[] }) {
  if (history.length === 0) return null;

  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm">
      <h3 className="text-lg font-bold text-zinc-900">瀏覽歷史</h3>
      <ul className="mt-3 space-y-1">
        {history.map(entry => (
          <li key={`${entry.shelf}-${entry.album}-${entry.timestamp}`}>
            <Link
              to={`/${encodeURIComponent(entry.shelf)}/${encodeURIComponent(entry.album)}`}
              className="block rounded px-2 py-1.5 text-sm text-zinc-700 hover:bg-zinc-50"
            >
              <span className="text-zinc-400">{entry.shelf} /</span> {entry.album}
              <span className="ml-2 text-xs text-zinc-400">
                {new Date(entry.timestamp).toLocaleDateString()}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
