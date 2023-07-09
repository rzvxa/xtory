import React from 'react';

import { useStore } from 'reactflow';

export default function useFocus(
  ref: React.RefObject<HTMLElement>,
  id: string,
  selected: boolean
) {
  const node = useStore((s) => s.nodeInternals.get(id));
  const focusCallback = React.useCallback(
    (resolve: undefined | (() => void) = undefined) => {
      // TODO find a better way than timeout,
      // TODO it won't work directy, messy workaround!
      setTimeout(() => {
        if (ref && ref.current && selected && node) {
          if (!node.data.focusOnInit) return;
          ref.current.focus();
          setTimeout(() => {
            ref?.current?.focus();
          }, 500);
          if (resolve) resolve();
        }
      }, 100);
    },
    [ref, selected, node]
  );

  return focusCallback;
}
