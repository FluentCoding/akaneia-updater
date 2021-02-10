const { ipcRenderer } = require("electron");

process.once("loaded", () => {
  window.addEventListener("message", (evt) => {
    switch (evt.data.type) {
      case "save-file":
        ipcRenderer.send(
          "save-file",
          evt.data.key,
          evt.data.name,
          evt.data.extensions
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
      case "get-binaries-path":
        ipcRenderer.send("get-binaries-path");
        break;
      default:
        break;
    }
  });
});
