import DirectoryPicker from '@/components/home/DirectoryPicker';
import HistoryList from '@/components/home/HistoryList';
import type { HistoryEntry } from '@/types';

export default function HomePage({
  photoRoot,
  onSelectDirectory,
  history,
  onRemoveHistoryItem,
  onClearHistory,
}: {
  photoRoot: string;
  onSelectDirectory: (path: string) => void;
  history: HistoryEntry[];
  onRemoveHistoryItem: (shelf: string, album: string, timestamp: number) => void;
  onClearHistory: () => void;
}) {
  return (
    <div className="space-y-6">
      <DirectoryPicker photoRoot={photoRoot} onSelect={onSelectDirectory} />
      <HistoryList history={history} onRemoveItem={onRemoveHistoryItem} onClearAll={onClearHistory} />
    </div>
  );
}
