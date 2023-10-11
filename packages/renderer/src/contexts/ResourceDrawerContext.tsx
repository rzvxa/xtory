import React from 'react';
import ResourceDrawer from '../components/ResourceDrawer';

export interface OpenResourceDrawerOptions {
  filterType?: string;
  onSelect: (uuid: string) => void;
}

interface ResourceDrawerContextValue {
  openResourceDrawer: (options: OpenResourceDrawerOptions) => void;
}

const ResourceDrawerContext = React.createContext<
  ResourceDrawerContextValue | undefined
>(undefined);

export function useResourceDrawer() {
  const context = React.useContext(ResourceDrawerContext);
  if (!context) {
    throw new Error(
      'useResourceDrawer must be used within a ResourceDrawerProvider'
    );
  }
  return context;
}

export function ResourceDrawerProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [filterType, setFilterType] = React.useState<string>('image');
  const [onSelectCallback, setOnSelectCallback] = React.useState<
    ((uuid: string) => void) | null
  >(null);

  const openResourceDrawer = React.useCallback(
    (options: OpenResourceDrawerOptions) => {
      setFilterType(options.filterType || 'image');
      // Store the callback in a way that React can handle
      setOnSelectCallback(() => options.onSelect);
      setIsOpen(true);
    },
    []
  );

  const handleClose = React.useCallback(() => {
    setIsOpen(false);
    setOnSelectCallback(null);
  }, []);

  const handleSelect = React.useCallback(
    (uuid: string) => {
      if (onSelectCallback) {
        onSelectCallback(uuid);
      }
      handleClose();
    },
    [onSelectCallback, handleClose]
  );

  const contextValue = React.useMemo(
    () => ({
      openResourceDrawer,
    }),
    [openResourceDrawer]
  );

  return (
    <ResourceDrawerContext.Provider value={contextValue}>
      {children}
      <ResourceDrawer
        open={isOpen}
        onClose={handleClose}
        onSelect={handleSelect}
        filterType={filterType}
      />
    </ResourceDrawerContext.Provider>
  );
}
