import React from 'react';

import ToolHeader from './ToolHeader';
import ProjectTree from '../ProjectTree';

export default function ProjectTool() {
  return (
    <>
      <ToolHeader title="Project" />
      <ProjectTree />
    </>
  );
}
