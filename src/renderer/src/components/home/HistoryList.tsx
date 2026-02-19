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

export default function HistoryList({
  history,
  onRemoveItem,
  onClearAll,
}: {
  history: HistoryEntry[];
  onRemoveItem: (shelf: string, album: string, timestamp: number) => void;
  onClearAll: () => void;
}) {
  return (
    <div className="rounded-xl border border-stone-200 bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold text-stone-900">最近瀏覽</h3>
        {history.length > 0 && (
          <button
            type="button"
            onClick={onClearAll}
            className="cursor-pointer text-sm text-stone-400 hover:text-stone-600"
          >
            清除紀錄
          </button>
        )}
      </div>
      {history.length === 0 ? (
        <p className="mt-3 text-base text-stone-400">尚未瀏覽任何相簿。</p>
      ) : (
        <ul className="mt-3 space-y-1">
          {history.map(entry => (
            <li key={`${entry.shelf}-${entry.album}-${entry.timestamp}`} className="flex items-center">
              <Link
                to={`/${encodeURIComponent(entry.shelf)}/${encodeURIComponent(entry.album)}`}
                className="block flex-1 rounded px-2 py-1.5 text-base text-stone-700 hover:bg-stone-50"
              >
                <span className="text-stone-400">{entry.shelf} /</span> {entry.album}
                <span className="ml-2 text-sm text-stone-400">
                  {formatRelativeDate(entry.timestamp)}
                </span>
              </Link>
              <button
                type="button"
                onClick={() => onRemoveItem(entry.shelf, entry.album, entry.timestamp)}
                className="ml-2 cursor-pointer text-stone-300 hover:text-stone-500"
                aria-label={`刪除 ${entry.shelf} / ${entry.album}`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="size-4">
                  <path d="M5.28 4.22a.75.75 0 0 0-1.06 1.06L6.94 8l-2.72 2.72a.75.75 0 1 0 1.06 1.06L8 9.06l2.72 2.72a.75.75 0 1 0 1.06-1.06L9.06 8l2.72-2.72a.75.75 0 0 0-1.06-1.06L8 6.94 5.28 4.22Z" />
                </svg>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
