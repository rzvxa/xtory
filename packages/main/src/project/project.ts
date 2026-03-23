import type { ProjectMessageBroker } from './projectMessageBroker';
import { BuiltinServices } from '../services/types';

export default interface Project {
  projectPath: string;

  messageBroker: ProjectMessageBroker;

  builtinServices: BuiltinServices;
}
