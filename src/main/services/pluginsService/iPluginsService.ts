export default interface IPluginsService {
  loadPlugins: Promise<void>;
  loadPlugin(pluginPath: string): Promise<boolean>;
}
