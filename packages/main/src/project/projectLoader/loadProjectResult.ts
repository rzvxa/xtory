import type { OpenProjectResult } from '@xtory/shared';
import type Project from '../project';

export default interface LoadProjectResult extends OpenProjectResult {
  project?: Project | undefined;
}
