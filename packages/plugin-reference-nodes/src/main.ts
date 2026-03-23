import type { PluginContext } from '@xtory/plugin-api';

export default function ({ api }: PluginContext) {
  api
    .addFileView('flow')
    .setFileType('xflow')
    .setOptional(true) // Only register if xflow fileType is already registered
    .setNodes([
      {
        type: 'Image',
        connections: { in: 0, out: { types: ['Plot'] } },
        renderer: 'reference-nodes/ImageNode',
      },
      {
        type: 'Note',
        connections: { in: 0, out: { types: ['Plot'] } },
        renderer: 'reference-nodes/NoteNode',
      },
    ]);
}
