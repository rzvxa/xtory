import React from 'react';

import TextField, { TextFieldProps } from '@mui/material/TextField';

export default function TextArea({ sx, ...rest }: TextFieldProps) {
  return (
    <TextField
      // eslint-disable-next-line react/jsx-props-no-spreading
      {...rest}
      sx={{ width: '100%', ...sx }}
    />
  );
}
