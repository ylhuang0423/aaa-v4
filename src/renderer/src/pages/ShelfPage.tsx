import { useParams, useSearchParams } from 'react-router';
import AlbumCard from '@/components/shelf/AlbumCard';
import type { PhotoLibrary, Viewed } from '@/types';

export default function ShelfPage({ library, viewed, columns }: { library: PhotoLibrary; viewed: Viewed; columns: number }) {
  const { shelf } = useParams<{ shelf: string }>();
  const [searchParams] = useSearchParams();
  const shelfData = library.find(s => s.name === shelf);

  if (!shelfData) {
    return <p className="text-base text-stone-500">找不到相關內容。</p>;
  }

  const viewedSet = new Set(viewed[shelfData.name] ?? []);
  const sortedAlbums = [...shelfData.albums].sort((a, b) => b.name.localeCompare(a.name));
  const keywords = (searchParams.get('q') ?? '').split(/\s+/).filter(Boolean);

  return (
    <div>
      <h2 className="text-xl font-bold text-stone-900">{shelfData.name}</h2>
      <p className="mt-1 text-base text-stone-500">
        {shelfData.albums.length} albums
        {viewedSet.size > 0 && <span className="text-stone-400">・{viewedSet.size} viewed</span>}
      </p>
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
