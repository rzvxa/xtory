import { HistoryItem } from './historyItem';

export interface FileHistory {
  now: HistoryItem | null;
  past: HistoryItem[];
  future: HistoryItem[];
}
