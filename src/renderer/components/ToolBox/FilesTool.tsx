import React from 'react';

import ToolContainer from './ToolContainer';
import ProjectTree from '../ProjectTree/ProjectTree';

export default function FilesTool() {
  return (
    <ToolContainer title="Files">
      <ProjectTree />
    </ToolContainer>
  );
}
