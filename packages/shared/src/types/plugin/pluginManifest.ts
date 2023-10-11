export interface PluginManifest {
  name: string;
  version: string | undefined;
  yumeApiVersion: number;
  license: string | undefined;
  main: string | undefined;
  rendererMain?: string | undefined;
  dependencies?: Record<string, string>;
  peerDependencies?: Record<string, string>;
}
