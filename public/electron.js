const electron = require("electron");
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
const path = require("path");
const isDev = require("electron-is-dev");

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 600,
    minWidth: 600,
    minHeight: 620,
    icon: __dirname + '/icon.png',
    title: "Akaneia Updater",
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
	    nodeIntegration: true,
		  enableRemoteModule: true,
    }
  });
  mainWindow.loadURL(isDev ? "http://localhost:3000" : `file://${path.join(__dirname, "/../build/index.html")}`);
  mainWindow.setMenu(null);
  mainWindow.on("closed", () => (mainWindow = null));

  electron.ipcMain.on('select-dirs', async (event, arg) => {
    const result = await electron.dialog.showOpenDialog(electron.mainWindow, {
      properties: ['openDirectory']
    })
    console.log('directories selected', result.filePaths)
    mainWindow.webContents.send('dir-selected-' + arg, result.filePaths)
  })
}
app.on("ready", createWindow);
app.on("window-all-closed", () => {
 	if (process.platform !== "darwin") {
    app.quit();
  }
});
app.on("activate", () => {
  if (mainWindow === null) {
    createWindow();
  }
});

console.log(app.getPath("userData"));