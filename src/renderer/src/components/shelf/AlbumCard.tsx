import { Link, useLocation } from 'react-router';
import { twMerge } from 'tailwind-merge';
import { saveScrollPosition } from '@/hooks/useScrollRestore';
import type { Album } from '@/types';
import highlightKeywords from '@/utils/highlightKeywords';

export default function AlbumCard({
  album,
  shelfName,
  viewed,
  keywords,
}: {
  album: Album;
  shelfName: string;
  viewed: boolean;
  keywords: string[];
}) {
  const location = useLocation();

  return (
    <Link
      to={`/${encodeURIComponent(shelfName)}/${encodeURIComponent(album.name)}${location.search}`}
      onClick={saveScrollPosition}
      className={twMerge(
        'group block rounded-xl border border-l-4 border-stone-200 bg-white p-4 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow hover:border-stone-300',
        viewed
          ? 'border-l-teal-600 hover:border-l-teal-700'
          : 'border-l-stone-500 hover:border-l-stone-600',
      )}
    >
      <h3
        className={twMerge(
          'text-base font-bold transition-colors',
          viewed
            ? 'text-teal-600 group-hover:text-teal-700'
            : 'text-stone-500 group-hover:text-stone-600',
        )}
      >
        {highlightKeywords(album.name, keywords)}
      </h3>
      <p className="mt-1 text-sm text-stone-500">{album.photos.length} 張照片</p>
    </Link>
  );
}
