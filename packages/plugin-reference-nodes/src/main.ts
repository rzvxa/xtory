import type { PluginContext } from 'packages/plugin-api';

export default function ({ api }: PluginContext) {
  api
    .addFileView('flow')
    .setFileType('xflow')
    .setOptional(true) // Only register if xflow fileType is already registered
    .setNodes([
      {
        type: 'Image',
        connections: { in: 1, out: 1 },
        renderer: 'reference-nodes/ImageNode',
      },
      {
        type: 'Note',
        connections: { in: 1, out: 1 },
        renderer: 'reference-nodes/NoteNode',
      },
    ]);
}
