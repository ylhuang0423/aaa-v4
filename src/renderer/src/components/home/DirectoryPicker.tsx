export default function DirectoryPicker({
  photoRoot,
  onSelect,
}: {
  photoRoot: string;
  onSelect: (path: string) => void;
}) {
  async function handleClick(): Promise<void> {
    const path = await window.api.selectDirectory();
    if (path) onSelect(path);
  }

  return (
    <div className="rounded-xl border border-stone-200 bg-white p-4 shadow-sm">
      <h3 className="text-xl font-bold text-stone-900">照片資料夾</h3>
      <div className="mt-3 flex items-center gap-3">
        <button
          type="button"
          onClick={handleClick}
          className="bg-primary rounded-lg px-4 py-2 text-base font-bold text-white hover:opacity-90"
        >
          {photoRoot ? '變更資料夾' : '選擇資料夾'}
        </button>
        {photoRoot && <span className="truncate text-base text-stone-500">{photoRoot}</span>}
      </div>
      {!photoRoot && (
        <p className="mt-2 text-base text-stone-400">
          請選擇照片所在的資料夾，選擇後會自動掃描所有相簿。
        </p>
      )}
    </div>
  );
}
