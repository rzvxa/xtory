import type { PluginContext } from 'packages/plugin-api';

export default function ({ api }: PluginContext) {
  api
    .addFileView('flow')
    .setFileType('xflow')
    .createMenuItem('New Flow', 'templates/empty.xflow')
    .setNodes([
      {
        type: 'Plot',
        connections: { in: 1, out: 1 },
        renderer: 'xflow/PlotNode',
      },
    ]);
}
