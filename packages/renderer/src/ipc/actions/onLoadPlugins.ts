import logger from 'renderer/logger';
import { IpcEvent } from '@xtory/shared';
import type { PluginsBatch } from '@xtory/shared/types/plugin';

export default async function onLoadPlugins(
  _event: IpcEvent,
  plugins: PluginsBatch
) {
  logger.trace('Loading plugin renderers...');

  try {
    await Promise.all(
      plugins.map(async (plug) => {
        try {
          // execute any renderer-side plugin entry point if provided
          if (plug.rendererMainFile) {
            logger.trace(
              `importing renderer ${plug.packageJson.name}(${plug.rendererMainFile})`
            );
            const u = new URL(plug.rendererMainFile);
            const pluginUri = `plugin://${u.pathname}${u.search}`;

            logger.trace(
              `importing ${plug.packageJson.name}(${pluginUri}) renderer`
            );

            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore - webpackIgnore is consumed by the bundler
            await import(/* webpackIgnore: true */ pluginUri);
          }
        } catch (error) {
          logger.error(`Failed to import renderer plugin bundle: ${error}`);
        }
      })
    );

    logger.trace('Plugin renderers loaded successfully');
  } catch (error) {
    logger.error(`Failed to load plugin renderers: ${error}`);
  }
}
