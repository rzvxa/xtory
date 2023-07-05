import React from 'react';

import { useReactFlow, useStore } from 'reactflow';

export default function useFocusAndCenter(
  ref: React.RefObject<HTMLElement>,
  id: string,
  selected: boolean
) {
  const { setCenter } = useReactFlow();
  const node = useStore((s) => s.nodeInternals.get(id));
  const focusCallback = React.useCallback(
    (resolve: undefined | (() => void) = undefined) => {
      // TODO find a better way than timeout,
      // TODO it won't work directy, messy workaround!
      setTimeout(() => {
        if (
          ref &&
          ref.current &&
          selected &&
          node &&
          node.width &&
          node.height
        ) {
          if (!node.data.focusOnInit) return;
          ref.current.focus();
          const x = node.position.x + node.width / 2;
          const y = node.position.y + node.height / 2;
          const zoom = 0.8;
          setCenter(x, y, { zoom, duration: 500 });
          if (resolve) resolve();
        }
      }, 100);
    },
    [ref, selected, node, setCenter]
  );

  return focusCallback;
}
