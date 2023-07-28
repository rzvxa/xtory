import type { OpenProjectResult } from 'shared/types';
import type Project from '../project';

export default interface LoadProjectResult extends OpenProjectResult {
  project?: Project | undefined;
}
