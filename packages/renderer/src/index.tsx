import { createRoot } from 'react-dom/client';
import React from 'react';
import * as ReactFlow from 'reactflow';
import {
  registerNodeRenderer,
  getNodeRenderer,
} from './services/plugins/NodeRegistry';
import { useResourceDrawer } from './contexts/ResourceDrawerContext';

import App from './App';

// Expose renderer api
window.React = React;
window.renderer = {
  modules: {
    React,
    ReactFlow,
  },
  hooks: {
    useResourceDrawer,
  },
  getNodeRenderer,
  registerNodeRenderer,
};

const container = document.getElementById('root') as HTMLElement;
const root = createRoot(container);
root.render(<App />);
