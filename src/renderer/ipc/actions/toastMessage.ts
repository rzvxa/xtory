import { IpcEvent } from 'shared/types';
import { EzSnackbarRef, SnackVariant } from 'renderer/ezSnackbar';

export default function toastMessage(
  _: IpcEvent,
  message: string,
  variant: SnackVariant
) {
  const { toast } = EzSnackbarRef;
  toast(message, variant);
}
