import { NavLink } from 'react-router';
import type { Shelf } from '@/types';

export default function Sidebar({ shelves }: { shelves: Shelf[] }) {
  return (
    <aside className="fixed top-12 bottom-0 left-0 w-48 overflow-y-auto border-r border-zinc-200 bg-white">
      <nav className="p-2">
        <NavLink
          to="/"
          end
          className={({ isActive }) =>
            `block rounded px-3 py-1.5 text-sm ${isActive ? 'bg-zinc-100 font-bold text-zinc-900' : 'text-zinc-600 hover:bg-zinc-50'}`
          }
        >
          Home
        </NavLink>
        {shelves.length > 0 && <div className="my-2 border-t border-zinc-100" />}
        {shelves.map(shelf => (
          <NavLink
            key={shelf.name}
            to={`/${encodeURIComponent(shelf.name)}`}
            className={({ isActive }) =>
              `block rounded px-3 py-1.5 text-sm ${isActive ? 'bg-zinc-100 font-bold text-zinc-900' : 'text-zinc-600 hover:bg-zinc-50'}`
            }
          >
            {shelf.name}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
