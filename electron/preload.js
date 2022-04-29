const { contextBridge } = require("electron");
const { ipcRenderer } = require("electron");

function showDialog(message) {
    message = JSON.stringify(message);
    ipcRenderer.invoke("showDialog", message);
    const result = ipcRenderer.sendSync('showDialog', message)
    return JSON.parse(result);
}

contextBridge.exposeInMainWorld('electron', {
    showDialog: showDialog,
});
contextBridge.exposeInMainWorld('preloadWasRun', 'preload was run');
