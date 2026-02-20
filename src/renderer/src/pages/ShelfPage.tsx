import { useParams, useSearchParams } from 'react-router';
import AlbumCard from '@/components/shelf/AlbumCard';
import useWebStorage from '@/hooks/useWebStorage';
import type { PhotoLibrary, Viewed } from '@/types';

export default function ShelfPage({ library, viewed, columns }: { library: PhotoLibrary; viewed: Viewed; columns: number }) {
  const { shelf } = useParams<{ shelf: string }>();
  const [searchParams] = useSearchParams();
  const [sortAsc, setSortAsc] = useWebStorage('local', 'albumSortAsc', true);
  const shelfData = library.find(s => s.name === shelf);

  if (!shelfData) {
    return <p className="text-base text-stone-500">找不到相關內容。</p>;
  }

  const viewedSet = new Set(viewed[shelfData.name] ?? []);
  const sortedAlbums = [...shelfData.albums].sort((a, b) =>
    sortAsc ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name),
  );
  const keywords = (searchParams.get('q') ?? '').split(/\s+/).filter(Boolean);

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-stone-900">{shelfData.name}</h2>
          <p className="mt-1 text-base text-stone-500">
            {shelfData.albums.length} albums
            {viewedSet.size > 0 && <span className="text-stone-400">・{viewedSet.size} viewed</span>}
          </p>
        </div>
        <button
          type="button"
          onClick={() => setSortAsc(prev => !prev)}
          className="cursor-pointer rounded-full bg-stone-200 p-3 text-stone-600 hover:bg-stone-300 active:bg-stone-400"
          aria-label={sortAsc ? '目前升序，點擊切換為降序' : '目前降序，點擊切換為升序'}
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`size-6 transition-transform duration-200 ${sortAsc ? '' : 'scale-y-[-1]'}`}>
            <line x1="4" y1="6" x2="13" y2="6" />
            <line x1="4" y1="12" x2="10" y2="12" />
            <line x1="4" y1="18" x2="7" y2="18" />
            <polyline points="18,7 18,17" />
            <polyline points="15,14 18,17 21,14" />
          </svg>
        </button>
      </div>
      <div className="mt-4 grid gap-3" style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}>
        {sortedAlbums.length === 0 ? (
          <p className="text-base text-stone-400">找不到符合的相簿。</p>
        ) : (
          sortedAlbums.map(album => (
            <AlbumCard
              key={album.name}
              album={album}
              shelfName={shelfData.name}
              viewed={viewedSet.has(album.name)}
              keywords={keywords}
            />
          ))
        )}
      </div>
    </div>
  );
}
