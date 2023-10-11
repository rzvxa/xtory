import type { NodeComponent } from '@xtory/plugin-api';

const registry: Record<string, NodeComponent> = {};

export function registerNodeRenderer(id: string, component: NodeComponent) {
  registry[id] = component;
}

export function getNodeRenderer(id: string): NodeComponent | null {
  return registry[id] ?? null;
}
