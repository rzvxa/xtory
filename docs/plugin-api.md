# Plugin API

## Architecture

A plugin is a npm package with a standard `package.json` file, For a package to actually be registered as a plugin by the xtory, you'll need to have a `xtoryApiVersion` field.

### Main Entry Point

Each plugin should have a `main` field which will be loaded on the main xtory process. This main entry point runs in the nodejs context and has full access to the main process environment, can make system call using nodejs API and is freed to import and use any of the package dependencies.

The main script is expected to have default function exported. This function is called with a single argument of type `PluginContext` which provides both the plugin's logger and the plugin API.

```ts
import type { PluginContext } from '@xtory/plugin-api';
import MyService from './myService';

export default function ({ logger, api }: PluginContext) {
  // Add a service to run in the main process. Renderers can call its public methods using `serviceCall` IPC calls.
  api.addService('my-service', () => new MyService(logger));

  // Adds a new file view for a custom extension
  api
    .addFileView('flow') // a node graph
    .setFileType('myFileExt')
    .createMenuItem('New MyFile', 'templates/empty.myFileExt')
    .setNodes([
      // List of nodes configurations
    ]);

  // Extend an existing file type view, It is especially useful for adding extra nodes to a flow
  // introduced by another plugin. For example `@xtory/plugin-reference-nodes` extends `xconv` flows
  // only if the file type is already registered via the `@xtory/plugin-xconv` plugin.
  api.addFileView('flow').setFileType('xconv').setOptional(true).setNodes([
    // List of nodes that will be added to the `xconv` file type.
  ]);
}
```

### Renderer Entry Point

Plugins can optionally have a renderer script configured by adding the `rendererMain` field to the `package.json`. The renderer script will run in a restricted browser process.
The browser process the main or any other window. The renderer script is not allowed to import plugin's dependencies at runtime via relative paths as it evaluated out of the file-system context. Due to this restriction, for importing dependencies we require to use a bundler and create a singular javascript file as the entry point. However it is recommended to avoid using dependencies in the renderer and sticking with it as a tool for pure visual components.

The renderer process does not provide nodejs integration or file-system access, The main means of communicating with the outside world is the IPC API exposed through `window.electron.ipcRenderer`.

The IPC calls can be used with a large set of builtin operations, including the `serviceCall`. The `serviceCall` IPC channel can be used to call to any xtory service, including the builtin services, and services introduced by the plugins. You can read more about service calls and other IPC channels in the [IPC documentation(TODO: fix link when added)](#).

```ts
const myServiceMethodResult = await window.electron.ipcRenderer.invoke(
  'serviceCall',
  'my-service',
  'myServiceMethodName',
  ['argument1', 'argument2']
);
```

Since the service is running in the main nodejs process, it is free to use any of the package's dependencies, and the nodejs API.

### Render APIs

By nature the of plugin's renderer script running in an restricted manner the compiled JavaScript entry point is not allowed to have any imports/requires which means you're only allowed to import types from the package's dependencies. The only things other than the browser API provided to the plugin's renderer are the global APIs exposed via the `@xtory/plugin-api/renderer`.

This includes the global `React` instance, and the `window` extensions under `window.renderer` and `window.electron` properties. You can read more about the exposed electron calls in the [IPC documentation(TODO: fix link when added)](#).

The `window.renderer` is an `XtoryRenderer` object shared across all plugins, providing them with the builtin UI components, exposed modules from the renderer, exposed custom react hooks, logger and other tools required for extending the graphical representation of the xtory.

This object will replace all of the imports in your script, and can be used with object decustruction for a clean way of accessing the plugin dependencies.

```ts
const {
  modules: {
    ReactFlow: { Handle, Position, useReactFlow },
  },
  ui: { icons, TextField, NodeContainer, Button, PickVariable },
  uuidv4,
  registerNodeRenderer,
} = window.renderer;
```

This object being shared with other plugins is an intentional design desicion so the plugins can extend the builtin functionalities for all plugins. It includes adding new functions, components or editing the existing toolset; for example replacing the default `TextArea` component with a rich text editor or adding support for color coding the nodes. While having a shared object can cause problematic plugin designs and coupling, it also provides many opportunities for extending the application in a way that wouldn't be possible otherwise. Therefore it is up to the plugin developers to use it with caution.

### Node Renderers

Plugins can add new types of flow nodes to the xtory, adding a new node usually requires a custom node renderer. While the nodes configurations are set up via the main function, The renderer should be registered in the renderer scripts. This can be done with the `window.renderer.registerNodeRenderer` function.

A node renderer is just a react component which accepts `Renderer.NodeProps` as its properties. A node renderer is registered under a string ID, this ID can be used in the main function to set up a node for using this custom node renderer.

```ts
/// <reference types="@xtory/plugin-api/renderer" />

const {
  ui: { NodeContainer, Handle },
  registerNodeRenderer,
} = window.renderer;

interface MyCustomNodeData {
  myData?: string;
}

registerNodeRenderer(
  'my-plugin-name/my-custom-node-renderer',
  function ({ selected, data }: Renderer.NodeProps<MyCustomNodeData>) {
    return (
      <NodeContainer title="My Node Name" selected={selected}>
        <Handle type="target" position={Position.Left} />
        {data.myData}
        <Handle type="source" position={Position.Right} id="default" />
      </NodeContainer>
    );
  }
);
```

With having a custom renderer registered as demonstrated in the example above, you can use it as your custom node renderer in the main function:

```ts
import type { PluginContext } from '@xtory/plugin-api';

export default function ({ logger, api }: PluginContext) {
  api
    .addFileView('flow')
    .setFileType('myFileExt')
    .setNodes([
      {
        type: 'MyNode',
        // ...rest of the options...
        renderer: 'my-plugin-name/my-custom-node-renderer',
      },
    ]);
}
```

Plugins can use renderers exposed for other plugins as well as the ones introduced by themselves. When depending on another plugin's renderers, is is highly recommended to have that plugin as a package dependency to ensure its presence.

### plugin:// URIs

While the renderer process is running independent of the file-system, the renderer scripts are still allowed to access the files in the plugins. However this can only happen indirectly and through the `plugin://` URIs. You can use `fetch` or even dynamic `import` calls on these URIs in order to load more files other than the renderer script in the rendering process.

The current iteration of the `plugin` protocol has full file-system access and works with both absolute and relative paths, However it is advised not to rely on it as it will have significant changes in the short-term future.

The current version of the protocol can be used similar to the `file://` URIs, they're treated as relative paths to the loaded project. The future iteration of the protocol will be much more limited to discourage anti-pattern design desicions in the plugins ecosystem.

### The `xtoryApiVersion`

Each release of of the xtory can have non-breaking or even breaking changes to its plugin APIs, The `xtoryApiVersion` is used for declaring the intended API version for a plugin. Xtory is then responsible for ensuring that its current API version is either the same or have backward compatibility with each plugin's expected API set.

While in the pre `1.0` releases the backward compatibility is of a lower importance(meaning that there are breaking changes happening regularly), the API versioning is here to ensure a mature plugins ecosystem can thrive down the road; Allowing for compatibility layers, and decoupling the API which a plugin is developed against vs. the one it is going to run with.

Note that the `xtoryApiVersion` is a single numeric version independent of the xtory's application version(which is a semantic version). Multiple versions of xtory can have the same `xtoryApiVersion`.
