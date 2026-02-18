import { app, IpcMainInvokeEvent, dialog } from 'electron';
import { getMainWindow } from 'main/windowManager';

export default async function restartApp(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  event: IpcMainInvokeEvent,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _: undefined
): Promise<void> {
  const mainWindow = getMainWindow();

  if (process.env.NODE_ENV === 'development') {
    // In development mode, electronmon doesn't auto-restart on exit
    // Show instructions to manually restart
    if (mainWindow) {
      await dialog.showMessageBox(mainWindow, {
        type: 'warning',
        title: 'Manual Restart Required',
        message: 'Plugin configuration has been updated.',
        detail:
          'In development mode, automatic restart is not available.\n\n' +
          'Please terminate the current process (Ctrl+C in terminal) and rerun:\n' +
          'npm run start',
        buttons: ['OK'],
      });
    }
  } else {
    // In production, use the standard relaunch mechanism
    app.relaunch();
    app.exit(0);
  }
}
