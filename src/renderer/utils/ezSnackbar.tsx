import {
  useSnackbar,
  closeSnackbar,
  SnackbarKey,
  ProviderContext,
} from 'notistack';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';

export type SnackVariant = 'error' | 'success' | 'warning' | 'info';
export type ToasterFunction = (message: string) => void;

export interface EzSnackbarContext extends ProviderContext {
  toast: (message: string, variant: SnackVariant) => void;
  toaster: {
    info: ToasterFunction;
    warning: ToasterFunction;
    error: ToasterFunction;
    success: ToasterFunction;
  };
}

const action = (snackbarId: SnackbarKey) => (
  <IconButton onClick={() => closeSnackbar(snackbarId)}>
    <CloseIcon />
  </IconButton>
);

export function useEzSnackbar() {
  const snackbar = useSnackbar();

  const toast = (message: string, variant: SnackVariant) => {
    snackbar.enqueueSnackbar(message, { variant, action });
  };

  const info = (message: string) => toast(message, 'info');
  const warning = (message: string) => toast(message, 'warning');
  const error = (message: string) => toast(message, 'error');
  const success = (message: string) => toast(message, 'success');

  return {
    ...snackbar,
    toast,
    toaster: { info, warning, error, success },
  };
}

let ezSnackbarGlobalRef: EzSnackbarContext;

export function EzSnackbarGlobalRef() {
  ezSnackbarGlobalRef = useEzSnackbar();
  return null;
}
export const EzSnackbarRef = {
  getRawRef() {
    return ezSnackbarGlobalRef;
  },
  toast(message: string, variant: SnackVariant) {
    ezSnackbarGlobalRef.toast(message, variant);
  },
  info(message: string) {
    ezSnackbarGlobalRef.toaster.info(message);
  },
  warning(message: string) {
    ezSnackbarGlobalRef.toaster.warning(message);
  },
  error(message: string) {
    ezSnackbarGlobalRef.toaster.error(message);
  },
  success(message: string) {
    ezSnackbarGlobalRef.toaster.success(message);
  },
};
