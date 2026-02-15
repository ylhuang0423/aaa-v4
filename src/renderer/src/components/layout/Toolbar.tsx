import { useState } from 'react';

export default function Toolbar({
  query,
  onQueryChange,
  onSearchSubmit,
  searchHistory,
  columns,
  onColumnsChange,
  showColumnSlider,
}: {
  query: string;
  onQueryChange: (query: string) => void;
  onSearchSubmit: (query: string) => void;
  searchHistory: string[];
  columns: number;
  onColumnsChange: (columns: number) => void;
  showColumnSlider: boolean;
}) {
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
    <header className="fixed inset-x-0 top-0 z-10 flex h-12 items-center gap-4 border-b border-zinc-200 bg-white px-4">
      <h1 className="text-sm font-bold text-zinc-700">aaa-v4</h1>
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={e => onQueryChange(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => setShowSuggestions(true)}
          onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
          placeholder="搜尋相簿..."
          className="focus:border-primary h-8 w-64 rounded-lg border border-zinc-200 bg-zinc-50 px-3 text-sm text-zinc-900 outline-none placeholder:text-zinc-400"
        />
        {showSuggestions && searchHistory.length > 0 && (
          <ul className="absolute top-full left-0 mt-1 w-64 rounded-lg border border-zinc-200 bg-white py-1 shadow-lg">
            {searchHistory.map(term => (
              <li key={term}>
                <button
                  type="button"
                  onMouseDown={() => handleSuggestionClick(term)}
                  className="block w-full px-3 py-1.5 text-left text-sm text-zinc-700 hover:bg-zinc-50"
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
          <label className="text-xs text-zinc-500">每排張數</label>
          <input
            type="range"
            min={2}
            max={6}
            value={columns}
            onChange={e => onColumnsChange(Number(e.target.value))}
            className="w-24"
          />
          <span className="w-4 text-center text-xs text-zinc-500">{columns}</span>
        </div>
      )}
    </header>
  );
}
