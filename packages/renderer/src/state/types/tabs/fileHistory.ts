import { HistoryItem } from './historyItem';

export interface FileHistory {
  activeHistory: HistoryItem;
  past: HistoryItem[];
  future: HistoryItem[];
}
