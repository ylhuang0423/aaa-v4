import { useParams } from 'react-router';
import AlbumCard from '@/components/shelf/AlbumCard';
import type { PhotoLibrary, Viewed } from '@/types';

export default function ShelfPage({ library, viewed }: { library: PhotoLibrary; viewed: Viewed }) {
  const { shelf } = useParams<{ shelf: string }>();
  const shelfData = library.find(s => s.name === shelf);

  if (!shelfData) {
    return <p className="text-sm text-zinc-500">Shelf not found.</p>;
  }

  const viewedSet = new Set(viewed[shelfData.name] ?? []);
  const sortedAlbums = [...shelfData.albums].sort((a, b) => b.name.localeCompare(a.name));

  return (
    <div>
      <h2 className="text-lg font-bold text-zinc-900">{shelfData.name}</h2>
      <p className="mt-1 text-sm text-zinc-500">{shelfData.albums.length} albums</p>
      <div className="mt-4 grid gap-3">
        {sortedAlbums.map(album => (
          <AlbumCard
            key={album.name}
            album={album}
            shelfName={shelfData.name}
            viewed={viewedSet.has(album.name)}
          />
        ))}
      </div>
    </div>
  );
}
