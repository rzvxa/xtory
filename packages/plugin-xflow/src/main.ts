import type { PluginContext } from 'packages/plugin-api';

export default function ({ api }: PluginContext) {
  api
    .addFileView('flow')
    .setFileType('xflow')
    .createMenuItem('New Flow', 'templates/empty.xflow')
    .setNodes([
      {
        type: 'Plot',
        connections: { in: { types: ['Plot'] }, out: { types: ['Plot'] } },
        renderer: 'xflow/PlotNode',
      },
    ]);
}
