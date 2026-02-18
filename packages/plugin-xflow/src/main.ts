/// <reference types="@xtory/plugin-api" />

api
  .addFileView('flow')
  .setFileType('xflow')
  .createMenuItem('New Flow', 'templates/empty.xflow')
  .setNodes([
    {
      type: 'Plot',
      connections: { in: 1, out: 1 },
      renderer: 'PlotNode.tsx',
    },
    {
      type: 'Conversation',
      connections: { in: 1, out: 1 },
    },
  ]);
