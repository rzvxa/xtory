export default interface PluginManifest {
  name: string;
  version: string | undefined;
  api: number;
  license: string | undefined;
  main: string | undefined;
}
