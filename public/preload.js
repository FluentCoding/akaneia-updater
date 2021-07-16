const { ipcRenderer } = require("electron");
const log = require("electron-log");

// Expose log to the renderer
window.log = log.functions;

// Event listeners
process.once("loaded", () => {
  window.addEventListener("message", (evt) => {
    switch (evt.data.type) {
      case "save-file":
        ipcRenderer.send(
          "save-file",
          evt.data.key,
          evt.data.fileFormatName,
          evt.data.extensions,
          evt.data.defaultName
        );
        break;
      case "download-tempfile":
        ipcRenderer.send(
          "download-tempfile",
          evt.data.key,
          evt.data.url,
          evt.data.options,
          evt.data.name
        );
        break;
      default:
        break;
    }
  });
});
