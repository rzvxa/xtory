import React from 'react';

import { Handle, Position, NodeProps } from 'reactflow';
import useInit from 'renderer/hooks/useInit';

import NodeContainer from './NodeContainer';
import useFocusAndCenter from './useFocusAndCenter';
import TextArea from './ContextualComponents/TextArea';

export default React.memo(({ id, selected }: NodeProps) => {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const focusAndCenter = useFocusAndCenter(inputRef, id, selected);

  useInit(focusAndCenter);

  return (
    <NodeContainer title="Plot" selected={selected}>
      <Handle type="target" position={Position.Left} />
      <TextArea variant="outlined" multiline minRows="5" inputRef={inputRef} />
      <Handle type="source" position={Position.Right} />
    </NodeContainer>
  );
});
