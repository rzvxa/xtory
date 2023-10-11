declare const ReactFlow: typeof import("reactflow"), useResourceDrawer: () => import("packages/plugin-api").UseResourceDrawer, registerNodeRenderer: (id: string, component: import("packages/plugin-api").NodeComponent) => void;
declare const Handle: React.MemoExoticComponent<React.ForwardRefExoticComponent<import("reactflow").HandleProps & Omit<React.HTMLAttributes<HTMLDivElement>, "id"> & React.RefAttributes<HTMLDivElement>>>, Position: typeof import("reactflow").Position, useReactFlow: typeof import("reactflow").useReactFlow;
interface ImageNodeData {
    src?: string;
    alt?: string;
}
interface ImageNodeProps {
    data: ImageNodeData;
    id: string;
}
declare function ImageNode({ data, id }: ImageNodeProps): React.JSX.Element;
interface NoteNodeData {
    text?: string;
}
interface NoteNodeProps {
    id: string;
    data: NoteNodeData;
    selected: boolean;
}
declare function NoteNode({ id, data, selected }: NoteNodeProps): React.JSX.Element;
//# sourceMappingURL=renderer.d.ts.map