import React from 'react';

import { NodeProps } from 'reactflow';
import useInit from 'renderer/hooks/useInit';

import NodeContainer from './NodeContainer';
import useFocusAndCenter from './useFocusAndCenter';
import TextArea from './ContextualComponents/TextArea';

export default React.memo(({ id, data, selected }: NodeProps) => {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const focusAndCenter = useFocusAndCenter(inputRef, id, selected);

  useInit(focusAndCenter);

  return (
    <NodeContainer title="Note" selected={selected}>
      <TextArea variant="outlined" multiline minRows="5" inputRef={inputRef} />
    </NodeContainer>
  );
});
