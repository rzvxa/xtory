import { IpcEvent } from '@xtory/shared';
import { EzSnackbarRef, SnackVariant } from 'renderer/utils/ezSnackbar';

export default function toastMessage(
  _: IpcEvent,
  message: string,
  variant: SnackVariant
) {
  const { toast } = EzSnackbarRef;
  toast(message, variant);
}
