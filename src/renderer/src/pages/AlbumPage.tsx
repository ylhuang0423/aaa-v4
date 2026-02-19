import { useEffect } from 'react';
import { Link, useParams } from 'react-router';
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
    return <p className="text-base text-stone-500">找不到此相簿。</p>;
  }

  return (
    <div>
      <h2 className="text-xl font-bold text-stone-900">
        <Link to={`/${encodeURIComponent(shelf!)}`} state={{ restoreScroll: true }} className="text-stone-400 hover:text-stone-600">
          {shelf}
        </Link>
        <span className="text-stone-300"> / </span>
        {albumData.name}
      </h2>
      <p className="mt-1 text-base text-stone-500">{albumData.photos.length} photos</p>
      <div className="mt-6">
        <PhotoGrid photos={albumData.photos} columns={columns} />
      </div>
    </div>
  );
}
