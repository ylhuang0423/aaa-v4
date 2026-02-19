import type { Photo } from '@/types';

export default function PhotoGrid({ photos, columns }: { photos: Photo[]; columns: number }) {
  if (photos.length === 0) {
    return <p className="text-base text-stone-400">此相簿沒有照片。</p>;
  }

  return (
    <div className="grid gap-2.5" style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}>
      {photos.map(photo => (
        <img
          key={photo.name}
          src={photo.url}
          alt={photo.name}
          loading="lazy"
          className="mb-2.5 block w-full rounded"
        />
      ))}
    </div>
  );
}
