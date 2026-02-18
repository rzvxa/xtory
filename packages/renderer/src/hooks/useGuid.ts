import React from 'react';

import { uuidv4 } from '@xtory/shared';

export default function useGuid() {
  // eslint-disable-next-line no-unused-vars
  const [guid, _] = React.useState(uuidv4());
  return guid;
}
