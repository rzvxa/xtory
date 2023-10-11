/// <reference types="@xtory/plugin-api" />

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
