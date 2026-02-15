import { useEffect } from 'react';
import { useParams } from 'react-router';
import PhotoGrid from '@/components/album/PhotoGrid';
import type { PhotoLibrary } from '@/types';

export default function AlbumPage({
  library,
  onView,
  columns,
}: {
  library: PhotoLibrary;
  onView: (shelf: string, album: string) => void;
  columns: number;
}) {
  const { shelf, album } = useParams<{ shelf: string; album: string }>();
  const shelfData = library.find(s => s.name === shelf);
  const albumData = shelfData?.albums.find(a => a.name === album);

  useEffect(() => {
    if (shelf && album) onView(shelf, album);
  }, [shelf, album, onView]);

  if (!albumData) {
    return <p className="text-sm text-zinc-500">Album not found.</p>;
  }

  return (
    <div>
      <h2 className="text-lg font-bold text-zinc-900">{albumData.name}</h2>
      <p className="mt-1 text-sm text-zinc-500">{albumData.photos.length} photos</p>
      <div className="mt-4">
        <PhotoGrid photos={albumData.photos} columns={columns} />
      </div>
    </div>
  );
}
