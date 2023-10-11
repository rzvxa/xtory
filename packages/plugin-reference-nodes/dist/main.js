api
    .addFileView('flow')
    .setFileType('xflow')
    .setOptional(true)
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
//# sourceMappingURL=main.js.map