import { Link } from 'react-router';
import { twMerge } from 'tailwind-merge';
import type { Album } from '@/types';

export default function AlbumCard({
  album,
  shelfName,
  viewed,
}: {
  album: Album;
  shelfName: string;
  viewed: boolean;
}) {
  return (
    <Link
      to={`/${encodeURIComponent(shelfName)}/${encodeURIComponent(album.name)}`}
      className={twMerge(
        'block rounded-xl border border-zinc-200 bg-white p-4 shadow-sm transition-colors hover:border-zinc-300',
        viewed && 'opacity-60',
      )}
    >
      <h3 className="text-sm font-bold text-zinc-900">{album.name}</h3>
      <p className="mt-1 text-xs text-zinc-500">{album.photos.length} photos</p>
    </Link>
  );
}
