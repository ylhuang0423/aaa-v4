import type { Photo } from '@/types';

export default function PhotoGrid({ photos, columns }: { photos: Photo[]; columns: number }) {
  if (photos.length === 0) {
    return <p className="text-sm text-stone-400">此相簿沒有照片。</p>;
  }

  return (
    <div style={{ columnCount: columns, columnGap: 10 }}>
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
