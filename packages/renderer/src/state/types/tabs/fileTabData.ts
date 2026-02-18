import { FileHistory } from './fileHistory';

export interface FileTabData {
  path: string;
  name: string;
  extension: string;
  content: string;
  history: FileHistory;
}
