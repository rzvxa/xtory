export default interface PluginConfig {
  name: string;
  version: string | undefined;
  api: number;
  license: string | undefined;
  main: string | undefined;
}
