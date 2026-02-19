import DirectoryPicker from '@/components/home/DirectoryPicker';
import HistoryList from '@/components/home/HistoryList';
import type { HistoryEntry } from '@/types';

export default function HomePage({
  photoRoot,
  onSelectDirectory,
  history,
}: {
  photoRoot: string;
  onSelectDirectory: (path: string) => void;
  history: HistoryEntry[];
}) {
  return (
    <div className="space-y-6">
      <DirectoryPicker photoRoot={photoRoot} onSelect={onSelectDirectory} />
      <HistoryList history={history} />
    </div>
  );
}
