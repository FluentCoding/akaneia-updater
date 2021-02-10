const electron = require("electron");
const isDev = require("electron-is-dev");
const isPackaged = require("electron-is-packaged");
const { autoUpdater } = require("electron-updater");
const log = require("electron-log");
const Store = require("electron-store");
const path = require("path");
const fetch = require("node-fetch");
const fs = require("fs");
const { platform } = require("os");

// Configure logging

autoUpdater.logger = log;
autoUpdater.logger.transports.file.level = "info";
log.info("App starting...");

// Module to control application life.
const app = electron.app;

// Module to control native browser window.
const BrowserWindow = electron.BrowserWindow;

// Window object
let mainWindow;

// Get the platform
const getPlatform = () => {
  switch (platform()) {
    case "aix":
    case "freebsd":
    case "linux":
    case "openbsd":
    case "android":
      return "linux";
    case "darwin":
    case "sunos":
      return "mac";
    case "win32":
      return "win";
    default:
      return undefined;
  }
};

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 600,
    minWidth: 600,
    minHeight: 620,
    icon: __dirname + "/icon.png",
    title: "Akaneia Updater",
    backgroundColor: "#303030", // avoid white corners when resizing
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      nodeIntegration: true,
      enableRemoteModule: true,
      contextIsolation: false,
    },
  });
  mainWindow.loadURL(
    isDev
      ? "http://localhost:3000"
      : `file://${path.join(__dirname, "/../build/index.html")}`
  );

  // Hide menu on prod
  if (!isDev) mainWindow.setMenu(null);

  mainWindow.on("closed", () => (mainWindow = null));

  // File saver
  electron.ipcMain.on("save-file", async (_event, key, name, extensions) => {
    if (!Array.isArray(extensions)) {
      mainWindow.webContents.send("saving-file-failed" + key);
      log.error(
        `extensions should be an array but his type is ${typeof extensions}`
      );
      return;
    } else {
      const result = await electron.dialog.showSaveDialogSync(mainWindow, {
        filters: [
          {
            name: name,
            extensions: extensions,
          },
        ],
      });
      if (!result) return;
      mainWindow.webContents.send("file-saved-" + key, result);
      return;
    }
  });

  // Temp file downloader
  electron.ipcMain.on(
    "download-tempfile",
    async (_event, key, url, options, name) => {
      const savePath = path.join(
        app.getPath("temp"),
        `${app.getName()}-${name}`
      );
      const res = await fetch(url, options);
      res.arrayBuffer().then((buffer) =>
        fs.writeFile(savePath, new Uint8Array(buffer), () => {
          log.info("IPCMAIN::TEMP-FILE");
          mainWindow.webContents.send("downloaded-tempfile-" + key, savePath);
          return;
        })
      );
    }
  );

  // Get the path of binaries
  electron.ipcMain.on("get-binaries-path", async (_event, key) => {
    log.info("IPCMAIN::BINARY-PATH");
    mainWindow.webContents.send(
      "binaries-path-" + key,
      !isDev && isPackaged
        ? path.join(
            path.dirname(app.getAppPath()),
            "..",
            "./Resources",
            "./bin"
          )
        : path.join(app.getAppPath(), "./resources", getPlatform())
    );
    return;
  });
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

// Auto Updates
app.on("ready", function () {
  autoUpdater.checkForUpdatesAndNotify();
});

// Make the store accessible by the renderer
Store.initRenderer();
