import React from 'react';

import { useReactFlow } from 'reactflow';

export default function useCenterOnNode() {
  const { getNode, setCenter } = useReactFlow();
  const [centerTarget, setCenterTarget] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (!centerTarget) return;
    setTimeout(() => {
      const node = getNode(centerTarget);
      if (node && node.width && node.height) {
        const x = node.position.x + node.width / 2;
        const y = node.position.y + node.height / 2;
        const zoom = 0.8;
        setCenter(x, y, { zoom, duration: 500 });
      }
    }, 100);
    setCenterTarget(null);
  }, [getNode, setCenter, centerTarget]);

  const centerOnNode = React.useCallback((nodeId: string) => {
    setCenterTarget(nodeId);
  }, []);

  return centerOnNode;
}
