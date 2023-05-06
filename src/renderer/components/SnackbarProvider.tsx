import React from 'react';
import { styled } from '@mui/material/styles';
import { SnackbarProvider as Provider, MaterialDesignContent } from 'notistack';

export interface SnackbarProviderProps {
  children: React.ReactNode;
}

const StyledMaterialDesignContent = styled(MaterialDesignContent)(
  ({ theme }) => ({
    '&.notistack-MuiContent-default': {
      backgroundColor: theme.palette.background.paper,
    },
    '&.notistack-MuiContent-success': {
      backgroundColor: theme.palette.success.main,
    },
    '&.notistack-MuiContent-error': {
      backgroundColor: theme.palette.error.main,
    },
    '&.notistack-MuiContent-warning': {
      backgroundColor: theme.palette.warning.main,
    },
    '&.notistack-MuiContent-info': {
      backgroundColor: theme.palette.info.main,
    },
  })
);

export default function SnackbarProvider({ children }: SnackbarProviderProps) {
  return (
    <Provider
      maxSnack={6}
      Components={{
        success: StyledMaterialDesignContent,
        error: StyledMaterialDesignContent,
      }}
    >
      {children}
    </Provider>
  );
}
