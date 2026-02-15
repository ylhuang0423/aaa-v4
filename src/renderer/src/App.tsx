import { useCallback, useEffect, useMemo, useState } from 'react';
import { HashRouter, Route, Routes, useLocation } from 'react-router';
import Sidebar from '@/components/layout/Sidebar';
import Toolbar from '@/components/layout/Toolbar';
import useWebStorage from '@/hooks/useWebStorage';
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
  const [photoRoot, setPhotoRoot] = useWebStorage('local', 'photoRoot', '');
  const [history, setHistory] = useWebStorage<HistoryEntry[]>('local', 'history', []);
  const [viewed, setViewed] = useWebStorage<Viewed>('session', 'viewed', {});
  const [columns, setColumns] = useWebStorage('local', 'albumColumns', 3);
  const [searchHistory, setSearchHistory] = useWebStorage<string[]>('local', 'searchHistory', []);
  const [library, setLibrary] = useState<PhotoLibrary>([]);
  const [loading, setLoading] = useState(!!photoRoot);
  const [query, setQuery] = useState('');

  useEffect(() => {
    if (!photoRoot) return;
    window.api.scanDirectory(photoRoot).then(data => {
      setLibrary(data);
      setLoading(false);
    });
  }, [photoRoot]);

  const handleSelectDirectory = useCallback(
    (path: string) => {
      setLoading(true);
      setPhotoRoot(path);
    },
    [setPhotoRoot],
  );

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
      <Sidebar shelves={filteredLibrary} library={sortedLibrary} viewed={viewed} />
      <main className="mt-12 ml-48 p-6">
        {loading && (
          <p className="text-sm text-stone-500">正在掃描照片資料夾...</p>
        )}
        <Routes>
          <Route
            path="/"
            element={
              <HomePage photoRoot={photoRoot} onSelectDirectory={handleSelectDirectory} history={history} />
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
