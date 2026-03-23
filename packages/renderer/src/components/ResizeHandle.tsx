import React from 'react';
import Box from '@mui/material/Box';

interface ResizeHandleProps {
  direction: 'horizontal' | 'vertical';
  onResize: (delta: number) => void;
}

export default function ResizeHandle({
  direction,
  onResize,
}: ResizeHandleProps) {
  const [isDragging, setIsDragging] = React.useState(false);
  const startPosRef = React.useRef<number>(0);

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
    startPosRef.current = direction === 'horizontal' ? e.clientX : e.clientY;
  };

  React.useEffect(() => {
    if (!isDragging) return undefined;

    const handleMouseMove = (e: MouseEvent) => {
      const currentPos = direction === 'horizontal' ? e.clientX : e.clientY;
      const delta = currentPos - startPosRef.current;
      startPosRef.current = currentPos;
      onResize(delta);
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, direction, onResize]);

  const isHorizontal = direction === 'horizontal';

  return (
    <Box
      onMouseDown={handleMouseDown}
      sx={{
        position: 'relative',
        cursor: isHorizontal ? 'col-resize' : 'row-resize',
        backgroundColor: isDragging
          ? (theme) => theme.palette.primary.main
          : 'transparent',
        width: isHorizontal ? '4px' : '100%',
        height: isHorizontal ? '100%' : '4px',
        flexShrink: 0,
        zIndex: isDragging ? 1000 : 1,
        transition: isDragging ? 'none' : 'background-color 0.2s',
        '&:hover': {
          backgroundColor: (theme) => theme.palette.primary.light,
        },
        userSelect: 'none',
      }}
    />
  );
}
