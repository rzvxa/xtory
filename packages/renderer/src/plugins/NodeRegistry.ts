import { ComponentType } from 'react';

const registry: Record<string, ComponentType> = {};

export function registerNodeRenderer(id: string, component: ComponentType) {
  registry[id] = component;
}

export function getNodeRenderer(id: string): ComponentType | null {
  return registry[id] ?? null;
}
