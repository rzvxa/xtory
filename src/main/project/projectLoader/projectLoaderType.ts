import type LoadProjectResult from './loadProjectResult';
import type { ProjectMessageBroker } from '../projectMessageBroker';

type LoadStrategy = (
  messageBroker: ProjectMessageBroker,
  projectPath: string
) => Promise<LoadProjectResult>;

export default LoadStrategy;
