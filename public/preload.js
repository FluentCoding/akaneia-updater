const { ipcRenderer } = require("electron");

process.once("loaded", () => {
  window.addEventListener("message", (evt) => {
    switch (evt.data.type) {
      case "select-dirs":
        ipcRenderer.send("select-dirs", evt.data.key);
        break;
      case "download-tempfile":
        ipcRenderer.send(
          "download-tempfile",
          evt.data.key,
          evt.data.url,
          evt.data.options,
          evt.data.savePath
        );
        break;
      default:
        break;
    }
  });
});
