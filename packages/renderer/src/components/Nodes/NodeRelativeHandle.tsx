import { Handle } from 'reactflow';
import type { NodeRelativeHandle } from '@xtory/plugin-api/renderer';

export default function RelativeHandle({
  style,
  children,
  ...props
}: NodeRelativeHandle) {
  return (
    <Handle
      // eslint-disable-next-line react/jsx-props-no-spreading
      {...props}
      style={{
        position: 'relative',
        top: 0,
        right: 0,
        transform: 'unset',
        ...style,
      }}
    >
      {children}
    </Handle>
  );
}
