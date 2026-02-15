import { useCallback, useEffect, useMemo, useState } from 'react';
import { HashRouter, Route, Routes, useLocation } from 'react-router';
import Sidebar from '@/components/layout/Sidebar';
import Toolbar from '@/components/layout/Toolbar';
import useLocalStorage from '@/hooks/useLocalStorage';
import useScrollRestore from '@/hooks/useScrollRestore';
import AlbumPage from '@/pages/AlbumPage';
import HomePage from '@/pages/HomePage';
import ShelfPage from '@/pages/ShelfPage';
import type { HistoryEntry, PhotoLibrary, Viewed } from '@/types';

export default function App() {
  return (
    <HashRouter>
      <AppContent />
    </HashRouter>
  );
}

function AppContent() {
  const location = useLocation();
  useScrollRestore();
  const [photoRoot, setPhotoRoot] = useLocalStorage('photoRoot', '');
  const [history, setHistory] = useLocalStorage<HistoryEntry[]>('history', []);
  const [viewed, setViewed] = useLocalStorage<Viewed>('viewed', {});
  const [columns, setColumns] = useLocalStorage('albumColumns', 3);
  const [searchHistory, setSearchHistory] = useLocalStorage<string[]>('searchHistory', []);
  const [library, setLibrary] = useState<PhotoLibrary>([]);
  const [query, setQuery] = useState('');

  useEffect(() => {
    if (!photoRoot) return;
    window.api.scanDirectory(photoRoot).then(setLibrary);
  }, [photoRoot]);

  const sortedLibrary = useMemo(
    () => [...library].sort((a, b) => b.name.localeCompare(a.name)),
    [library],
  );

  const filteredLibrary = useMemo(() => {
    const keywords = query.split(/\s+/).filter(Boolean);
    if (keywords.length === 0) return sortedLibrary;
    return sortedLibrary
      .map(shelf => ({
        ...shelf,
        albums: shelf.albums.filter(album => keywords.some(kw => album.name.includes(kw))),
      }))
      .filter(shelf => shelf.albums.length > 0);
  }, [sortedLibrary, query]);

  const markViewed = useCallback(
    (shelf: string, album: string) => {
      setViewed(prev => {
        const albums = prev[shelf] ?? [];
        if (albums.includes(album)) return prev;
        return { ...prev, [shelf]: [...albums, album] };
      });
      setHistory(prev => {
        const entry: HistoryEntry = { shelf, album, timestamp: Date.now() };
        const filtered = prev.filter(h => !(h.shelf === shelf && h.album === album));
        return [entry, ...filtered].slice(0, 20);
      });
    },
    [setViewed, setHistory],
  );

  const saveSearch = useCallback(
    (q: string) => {
      const trimmed = q.trim();
      if (!trimmed) return;
      setSearchHistory(prev => {
        const filtered = prev.filter(s => s !== trimmed);
        return [trimmed, ...filtered].slice(0, 20);
      });
    },
    [setSearchHistory],
  );

  const isAlbumRoute = /^\/[^/]+\/[^/]+$/.test(location.pathname);

  return (
    <>
      <Toolbar
        query={query}
        onQueryChange={setQuery}
        onSearchSubmit={saveSearch}
        searchHistory={searchHistory}
        columns={columns}
        onColumnsChange={setColumns}
        showColumnSlider={isAlbumRoute}
      />
      <Sidebar shelves={filteredLibrary} />
      <main className="mt-12 ml-48 p-6">
        <Routes>
          <Route
            path="/"
            element={
              <HomePage photoRoot={photoRoot} onSelectDirectory={setPhotoRoot} history={history} />
            }
          />
          <Route path="/:shelf" element={<ShelfPage library={filteredLibrary} viewed={viewed} />} />
          <Route
            path="/:shelf/:album"
            element={<AlbumPage library={sortedLibrary} onView={markViewed} columns={columns} />}
          />
        </Routes>
      </main>
    </>
  );
}
