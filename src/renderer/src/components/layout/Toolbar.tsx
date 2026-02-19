import { useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router';

export default function Toolbar({
  query,
  onSearch,
  onClearSearch,
  searchHistory,
  onRemoveHistoryItem,
  onClearHistory,
  slider,
  onRefresh,
}: {
  query: string;
  onSearch: (q: string) => void;
  onClearSearch: () => void;
  searchHistory: string[];
  onRemoveHistoryItem: (term: string) => void;
  onClearHistory: () => void;
  slider?: { label: string; min: number; max: number; value: number; onChange: (v: number) => void };
  onRefresh?: () => void;
}) {
  const navigate = useNavigate();
  const [chips, setChips] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [suggestions, setSuggestions] = useState(false);
  const [prevQuery, setPrevQuery] = useState(query);
  const inputRef = useRef<HTMLInputElement>(null);

  if (prevQuery !== query) {
    setPrevQuery(query);
    setChips(query.split(/\s+/).filter(Boolean));
    setInputValue('');
  }

  function submitSearch(finalChips: string[]): void {
    if (finalChips.length === 0) {
      onClearSearch();
    } else {
      onSearch(finalChips.join(' '));
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>): void {
    if (e.nativeEvent.isComposing) return;

    if (e.key === ' ') {
      const trimmed = inputValue.trim();
      if (trimmed) {
        e.preventDefault();
        setChips(prev => [...prev, trimmed]);
        setInputValue('');
      }
      return;
    }

    if (e.key === 'Enter') {
      e.preventDefault();
      const trimmed = inputValue.trim();
      const finalChips = trimmed ? [...chips, trimmed] : chips;
      setChips(finalChips);
      setInputValue('');
      submitSearch(finalChips);
      setSuggestions(false);
      return;
    }

    if (e.key === 'Backspace' && inputValue === '') {
      if (chips.length > 0) {
        const newChips = chips.slice(0, -1);
        setChips(newChips);
        submitSearch(newChips);
      }
    }

    if (e.key === 'Escape') {
      setChips([]);
      setInputValue('');
      onClearSearch();
      setSuggestions(false);
      inputRef.current?.blur();
    }
  }

  function handleSearchClick(): void {
    const trimmed = inputValue.trim();
    const finalChips = trimmed ? [...chips, trimmed] : chips;
    setChips(finalChips);
    setInputValue('');
    submitSearch(finalChips);
    setSuggestions(false);
  }

  function handleRemoveChip(index: number): void {
    const newChips = chips.filter((_, i) => i !== index);
    setChips(newChips);
    submitSearch(newChips);
    inputRef.current?.focus();
  }

  function handleSuggestionClick(term: string): void {
    const keywords = term.split(/\s+/).filter(Boolean);
    setChips(keywords);
    setInputValue('');
    submitSearch(keywords);
    setSuggestions(false);
  }

  return (
    <header className="fixed inset-x-0 top-0 z-10 flex h-16 items-center gap-4 border-b border-stone-200 bg-white px-4">
      <Link to="/" className="text-xl font-bold text-secondary">
        aaa v4
      </Link>
      <div className="flex items-center gap-1">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="rounded-full bg-stone-100 p-2 text-stone-500 transition-colors hover:bg-stone-200 hover:text-stone-600 active:bg-stone-300 active:text-stone-700"
          aria-label="上一頁"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="size-5">
            <path fillRule="evenodd" d="M11.78 5.22a.75.75 0 0 1 0 1.06L8.06 10l3.72 3.72a.75.75 0 1 1-1.06 1.06l-4.25-4.25a.75.75 0 0 1 0-1.06l4.25-4.25a.75.75 0 0 1 1.06 0Z" clipRule="evenodd" />
          </svg>
        </button>
        <button
          type="button"
          onClick={() => navigate(1)}
          className="rounded-full bg-stone-100 p-2 text-stone-500 transition-colors hover:bg-stone-200 hover:text-stone-600 active:bg-stone-300 active:text-stone-700"
          aria-label="下一頁"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="size-5">
            <path fillRule="evenodd" d="M8.22 5.22a.75.75 0 0 1 1.06 0l4.25 4.25a.75.75 0 0 1 0 1.06l-4.25 4.25a.75.75 0 1 1-1.06-1.06L11.94 10 8.22 6.28a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" />
          </svg>
        </button>
        {onRefresh && (
          <button
            type="button"
            onClick={onRefresh}
            className="rounded-full bg-stone-100 p-2 text-stone-500 transition-colors hover:bg-stone-200 hover:text-stone-600 active:bg-stone-300 active:text-stone-700"
            aria-label="重新掃描"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="size-5">
              <path fillRule="evenodd" d="M15.312 11.424a5.5 5.5 0 0 1-9.201 2.466l-.312-.311h2.433a.75.75 0 0 0 0-1.5H4.598a.75.75 0 0 0-.75.75v3.634a.75.75 0 0 0 1.5 0v-2.033l.31.31A7 7 0 0 0 17 11.25a.75.75 0 0 0-1.688-.326ZM4.688 8.576a5.5 5.5 0 0 1 9.201-2.466l.312.311H11.77a.75.75 0 0 0 0 1.5h3.634a.75.75 0 0 0 .75-.75V3.537a.75.75 0 0 0-1.5 0v2.033l-.31-.31A7 7 0 0 0 3 8.75a.75.75 0 0 0 1.688.326Z" clipRule="evenodd" />
            </svg>
          </button>
        )}
      </div>
      <div className="relative">
        <div className="flex items-center gap-2">
          <div
            className="flex h-10 w-80 cursor-text items-center rounded-lg border border-stone-200 bg-stone-50 focus-within:border-primary"
            onMouseDown={e => {
              if (e.target !== inputRef.current) {
                e.preventDefault();
                inputRef.current?.focus();
              }
            }}
          >
            <div className="flex flex-1 items-center gap-1 overflow-x-auto [scrollbar-width:none] px-2.5">
              {chips.map((chip, i) => (
                <span key={i} className="inline-flex shrink-0 items-center gap-1 rounded-full bg-stone-200 px-2 py-0.5 text-sm text-stone-700">
                  {chip}
                  <button
                    type="button"
                    onMouseDown={e => {
                      e.preventDefault();
                      handleRemoveChip(i);
                    }}
                    className="text-stone-400 hover:text-stone-600"
                    aria-label={`移除 ${chip}`}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="size-3">
                      <path d="M5.28 4.22a.75.75 0 0 0-1.06 1.06L6.94 8l-2.72 2.72a.75.75 0 1 0 1.06 1.06L8 9.06l2.72 2.72a.75.75 0 1 0 1.06-1.06L9.06 8l2.72-2.72a.75.75 0 0 0-1.06-1.06L8 6.94 5.28 4.22Z" />
                    </svg>
                  </button>
                </span>
              ))}
              <input
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={e => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                onFocus={() => setSuggestions(true)}
                onClick={() => setSuggestions(true)}
                onBlur={() => setSuggestions(false)}
                placeholder={chips.length === 0 ? '搜尋相簿...' : ''}
                className="min-w-[4rem] flex-1 bg-transparent text-base text-stone-900 outline-none placeholder:text-stone-400"
              />
            </div>
            {(chips.length > 0 || inputValue) && (
              <button
                type="button"
                onMouseDown={e => {
                  e.preventDefault();
                  setChips([]);
                  setInputValue('');
                  onClearSearch();
                  inputRef.current?.focus();
                }}
                className="shrink-0 pr-2 text-stone-400 hover:text-stone-600"
                aria-label="清除搜尋"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="size-4">
                  <path d="M5.28 4.22a.75.75 0 0 0-1.06 1.06L6.94 8l-2.72 2.72a.75.75 0 1 0 1.06 1.06L8 9.06l2.72 2.72a.75.75 0 1 0 1.06-1.06L9.06 8l2.72-2.72a.75.75 0 0 0-1.06-1.06L8 6.94 5.28 4.22Z" />
                </svg>
              </button>
            )}
          </div>
          <button
            type="button"
            onClick={handleSearchClick}
            className="rounded-full bg-stone-100 p-2 text-stone-500 transition-colors hover:bg-stone-200 hover:text-stone-600 active:bg-stone-300 active:text-stone-700"
            aria-label="搜尋"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="size-5">
              <path fillRule="evenodd" d="M9 3.5a5.5 5.5 0 1 0 0 11 5.5 5.5 0 0 0 0-11ZM2 9a7 7 0 1 1 12.452 4.391l3.328 3.329a.75.75 0 1 1-1.06 1.06l-3.329-3.328A7 7 0 0 1 2 9Z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
        {suggestions && searchHistory.length > 0 && (
          <ul className="absolute top-full left-0 mt-1 w-80 rounded-lg border border-stone-200 bg-white py-1 shadow-lg">
            <li className="flex items-center justify-between px-3 py-1">
              <span className="text-sm text-stone-400">搜尋紀錄</span>
              <button
                type="button"
                onMouseDown={e => {
                  e.preventDefault();
                  onClearHistory();
                  setChips([]);
                  setInputValue('');
                  onClearSearch();
                }}
                className="text-sm text-stone-400 hover:text-stone-600"
              >
                清除紀錄
              </button>
            </li>
            {searchHistory.slice(0, 8).map(term => (
              <li key={term} className="flex items-center px-3 py-1.5">
                <button
                  type="button"
                  onMouseDown={e => {
                    e.preventDefault();
                    handleSuggestionClick(term);
                  }}
                  className="flex flex-1 flex-wrap gap-1 text-left"
                >
                  {term.split(/\s+/).filter(Boolean).map((kw, i) => (
                    <span key={i} className="inline-flex rounded-full bg-stone-100 px-2 py-0.5 text-sm text-stone-600">
                      {kw}
                    </span>
                  ))}
                </button>
                <button
                  type="button"
                  onMouseDown={e => {
                    e.preventDefault();
                    e.stopPropagation();
                    onRemoveHistoryItem(term);
                  }}
                  className="ml-2 text-stone-300 hover:text-stone-500"
                  aria-label={`刪除搜尋紀錄 ${term}`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="size-3">
                    <path d="M5.28 4.22a.75.75 0 0 0-1.06 1.06L6.94 8l-2.72 2.72a.75.75 0 1 0 1.06 1.06L8 9.06l2.72 2.72a.75.75 0 1 0 1.06-1.06L9.06 8l2.72-2.72a.75.75 0 0 0-1.06-1.06L8 6.94 5.28 4.22Z" />
                  </svg>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
      {slider && (
        <div className="ml-auto flex items-center gap-2">
          <label className="text-sm text-stone-500">{slider.label}</label>
          <input
            type="range"
            min={slider.min}
            max={slider.max}
            value={slider.value}
            onChange={e => slider.onChange(Number(e.target.value))}
            className="w-24"
          />
          <span className="w-4 text-center text-sm text-stone-500">{slider.value}</span>
        </div>
      )}
    </header>
  );
}
