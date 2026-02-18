import type { PluginManifest } from './pluginManifest';

export interface PluginEntry {
  mainFile: string;
  packageJson: PluginManifest;
  rendererMainFile?: string;
}

export type PluginsBatch = Array<PluginEntry>;
