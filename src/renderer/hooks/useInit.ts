import React from 'react';

export default function useInit(initCallback: (resolve: () => void) => void) {
  const [initialized, setInitialized] = React.useState(false);

  const resolve = () => setInitialized(true);

  React.useEffect(() => {
    if (!initialized) {
      initCallback(resolve);
    }
  }, [initialized, initCallback]);
}
