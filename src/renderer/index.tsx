import { createRoot } from 'react-dom/client';
import { Provider as ReduxProvider } from 'react-redux';

import { store } from './state/store/index';
import App from './App';

const container = document.getElementById('root') as HTMLElement;
const root = createRoot(container);
root.render(
  <ReduxProvider store={store}>
    <App />
  </ReduxProvider>
);

// calling IPC exposed from preload script
window.electron.ipcRenderer.once('customIPC', (arg) => {
  // eslint-disable-next-line no-console
  console.log(arg);
});
window.electron.ipcRenderer.sendMessage('customIPC', ['setProjectPath']);
