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
    <div className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={handleClick}
          className="bg-primary rounded-lg px-4 py-2 text-sm font-bold text-white hover:opacity-90"
        >
          {photoRoot ? '變更資料夾' : '選擇照片資料夾'}
        </button>
        {photoRoot && <span className="truncate text-sm text-zinc-500">{photoRoot}</span>}
      </div>
    </div>
  );
}
