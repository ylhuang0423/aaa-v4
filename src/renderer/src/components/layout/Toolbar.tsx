import { useState } from 'react';
import { useNavigate } from 'react-router';

export default function Toolbar({
  query,
  onQueryChange,
  onSearchSubmit,
  searchHistory,
  columns,
  onColumnsChange,
  showColumnSlider,
  onRefresh,
}: {
  query: string;
  onQueryChange: (query: string) => void;
  onSearchSubmit: (query: string) => void;
  searchHistory: string[];
  columns: number;
  onColumnsChange: (columns: number) => void;
  showColumnSlider: boolean;
  onRefresh?: () => void;
}) {
  const navigate = useNavigate();
  const [showSuggestions, setShowSuggestions] = useState(false);

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>): void {
    if (e.key === 'Enter') {
      onSearchSubmit(query);
      setShowSuggestions(false);
    }
  }

  function handleSuggestionClick(term: string): void {
    onQueryChange(term);
    onSearchSubmit(term);
    setShowSuggestions(false);
  }

  return (
    <header className="fixed inset-x-0 top-0 z-10 flex h-12 items-center gap-4 border-b border-stone-200 bg-white px-4">
      <h1 className="text-sm font-bold text-stone-700">aaa</h1>
      <div className="flex items-center gap-1">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="rounded-full bg-stone-100 p-1.5 text-stone-500 transition-colors hover:bg-stone-200 hover:text-stone-600 active:bg-stone-300 active:text-stone-700"
          aria-label="上一頁"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="size-4">
            <path fillRule="evenodd" d="M11.78 5.22a.75.75 0 0 1 0 1.06L8.06 10l3.72 3.72a.75.75 0 1 1-1.06 1.06l-4.25-4.25a.75.75 0 0 1 0-1.06l4.25-4.25a.75.75 0 0 1 1.06 0Z" clipRule="evenodd" />
          </svg>
        </button>
        <button
          type="button"
          onClick={() => navigate(1)}
          className="rounded-full bg-stone-100 p-1.5 text-stone-500 transition-colors hover:bg-stone-200 hover:text-stone-600 active:bg-stone-300 active:text-stone-700"
          aria-label="下一頁"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="size-4">
            <path fillRule="evenodd" d="M8.22 5.22a.75.75 0 0 1 1.06 0l4.25 4.25a.75.75 0 0 1 0 1.06l-4.25 4.25a.75.75 0 1 1-1.06-1.06L11.94 10 8.22 6.28a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" />
          </svg>
        </button>
        {onRefresh && (
          <button
            type="button"
            onClick={onRefresh}
            className="rounded-full bg-stone-100 p-1.5 text-stone-500 transition-colors hover:bg-stone-200 hover:text-stone-600 active:bg-stone-300 active:text-stone-700"
            aria-label="重新掃描"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="size-4">
              <path fillRule="evenodd" d="M15.312 11.424a5.5 5.5 0 0 1-9.201 2.466l-.312-.311h2.433a.75.75 0 0 0 0-1.5H4.598a.75.75 0 0 0-.75.75v3.634a.75.75 0 0 0 1.5 0v-2.033l.31.31A7 7 0 0 0 17 11.25a.75.75 0 0 0-1.688-.326ZM4.688 8.576a5.5 5.5 0 0 1 9.201-2.466l.312.311H11.77a.75.75 0 0 0 0 1.5h3.634a.75.75 0 0 0 .75-.75V3.537a.75.75 0 0 0-1.5 0v2.033l-.31-.31A7 7 0 0 0 3 8.75a.75.75 0 0 0 1.688.326Z" clipRule="evenodd" />
            </svg>
          </button>
        )}
      </div>
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={e => onQueryChange(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => setShowSuggestions(true)}
          onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
          placeholder="搜尋相簿..."
          className="focus:border-primary h-8 w-64 rounded-lg border border-stone-200 bg-stone-50 px-3 text-sm text-stone-900 outline-none placeholder:text-stone-400"
        />
        {showSuggestions && searchHistory.length > 0 && (
          <ul className="absolute top-full left-0 mt-1 w-64 rounded-lg border border-stone-200 bg-white py-1 shadow-lg">
            {searchHistory.map(term => (
              <li key={term}>
                <button
                  type="button"
                  onMouseDown={() => handleSuggestionClick(term)}
                  className="block w-full px-3 py-1.5 text-left text-sm text-stone-700 hover:bg-stone-50"
                >
                  {term}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
      {showColumnSlider && (
        <div className="ml-auto flex items-center gap-2">
          <label className="text-xs text-stone-500">每排張數</label>
          <input
            type="range"
            min={2}
            max={6}
            value={columns}
            onChange={e => onColumnsChange(Number(e.target.value))}
            className="w-24"
          />
          <span className="w-4 text-center text-xs text-stone-500">{columns}</span>
        </div>
      )}
    </header>
  );
}
