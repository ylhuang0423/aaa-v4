import { NavLink } from 'react-router';
import type { PhotoLibrary, Viewed } from '@/types';

export default function Sidebar({
  shelves,
  library,
  viewed,
}: {
  shelves: { name: string }[];
  library: PhotoLibrary;
  viewed: Viewed;
}) {
  function isFullyViewed(shelfName: string): boolean {
    const shelf = library.find(s => s.name === shelfName);
    if (!shelf || shelf.albums.length === 0) return false;
    const viewedAlbums = viewed[shelfName] ?? [];
    return shelf.albums.every(a => viewedAlbums.includes(a.name));
  }

  function getAlbumCount(shelfName: string): number {
    const shelf = library.find(s => s.name === shelfName);
    return shelf?.albums.length ?? 0;
  }

  return (
    <aside className="fixed top-12 bottom-0 left-0 w-48 overflow-y-auto border-r border-stone-200 bg-white">
      <nav className="p-2">
        <NavLink
          to="/"
          end
          className={({ isActive }) =>
            `block rounded px-3 py-1.5 text-sm ${isActive ? 'bg-stone-100 font-bold text-stone-900' : 'text-stone-600 hover:bg-stone-50'}`
          }
        >
          Home
        </NavLink>
        {shelves.length > 0 && <div className="my-2 border-t border-stone-100" />}
        {shelves.map(shelf => {
          const fullyViewed = isFullyViewed(shelf.name);
          const count = getAlbumCount(shelf.name);
          return (
            <NavLink
              key={shelf.name}
              to={`/${encodeURIComponent(shelf.name)}`}
              className={({ isActive }) =>
                `flex items-center justify-between rounded px-3 py-1.5 text-sm ${
                  isActive
                    ? 'bg-stone-100 font-bold text-stone-900'
                    : fullyViewed
                      ? 'text-teal-600 hover:bg-stone-50'
                      : 'text-stone-600 hover:bg-stone-50'
                }`
              }
            >
              <span>{shelf.name}</span>
              {count > 0 && <span className="text-xs text-stone-400">{count}</span>}
            </NavLink>
          );
        })}
      </nav>
    </aside>
  );
}
