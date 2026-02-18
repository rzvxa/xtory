export default interface PluginsState {
  LoadedPlugins: { [name: string]: Function };
  isLoading: boolean;
  loadingMessage: string;
  pluginCount: number;
  loadTime: number; // in milliseconds
}
