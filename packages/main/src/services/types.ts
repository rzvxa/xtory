import { IService } from '@xtory/plugin-api';

import type ProjectWatchService from 'main/services/projectWatchService';
import type LoggingService from 'main/services/loggingService';
import type PluginsService from 'main/services/pluginsService';
import type ProjectSettingsService from 'main/services/projectSettingsService';
import type ResourceService from 'main/services/resourceService';
import type CharacterService from 'main/services/characterService';

export interface BuiltinServices {
  watch: ProjectWatchService;
  logger: LoggingService;
  plugins: PluginsService;
  settings: ProjectSettingsService;
  resources: ResourceService;
  characters: CharacterService;
}

export type ServiceType<S extends string> = S extends keyof BuiltinServices
  ? BuiltinServices[S]
  : IService;
