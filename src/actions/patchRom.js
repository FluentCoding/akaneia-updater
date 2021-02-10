import { execFile } from "child_process";
import { ipcRenderer } from "electron";
import path from "path";

export default function patchRom(
  asset,
  isoFile,
  destFile,
  version,
  clear,
  store,
  enqueueSnackbar,
  closeSnackbar,
  index
) {
  if (!asset) return "Error";
  if (!isoFile) isoFile = store.get("vanillaIsoPath");

  var lastSnackbar = undefined;
  const showInfo = (message) =>
    enqueueSnackbar &&
    enqueueSnackbar(message, {
      variant: "info",
      autoHideDuration: null,
      action: (key) => {
        lastSnackbar = key;
      },
    });

  return new Promise(async (resolve, reject) => {
    try {
      showInfo("Downloading patch file...");

      window.postMessage({
        type: "download-tempfile",
        key: index,
        url: asset.downloadUrl,
        options: {
          redirect: "follow",
          headers: {
            "Content-Type": "application/octet-stream",
          },
        },
        name: `${asset.name}-${version}`,
      });

      ipcRenderer.on("downloaded-tempfile-" + index, (_event, assetPath) => {
        showInfo("Patching game...");
        // Get the base path of binaries
        window.postMessage({
          type: "get-binaries-path",
        });
        ipcRenderer.on("binaries-path", (_event, binariesPath) => {
          const xdeltaPath = path.resolve(path.join(binariesPath, "./xdelta"));
          try {
            execFile(
              xdeltaPath,
              ["-dfs", isoFile, assetPath, destFile],
              (err, stdout, stderr) => {
                closeSnackbar && closeSnackbar(lastSnackbar);
                if (err) {
                  console.log(err);
                  console.log(stderr);
                  enqueueSnackbar &&
                    enqueueSnackbar("Patch failed!", {
                      variant: "error",
                    });
                } else {
                  enqueueSnackbar &&
                    enqueueSnackbar("Patch succeeded!", {
                      variant: "success",
                    });
                  let trackedIsos = store.get("trackedIsos", []);
                  const newTrackedIso = {
                    name:
                      "Akaneia " +
                      asset.name?.charAt(0).toUpperCase() +
                      asset.name.slice(1),
                    version: version,
                    destPath: destFile,
                    owner: "akaneia",
                    repo: "akaneia-build",
                    assetName: asset.name,
                  };
                  if (index !== undefined) {
                    trackedIsos[index] = newTrackedIso;
                  } else {
                    trackedIsos.push(newTrackedIso);
                  }
                  store.set("trackedIsos", trackedIsos);
                }
                clear && clear();
                resolve();
              }
            );
          } catch (error) {
            closeSnackbar && closeSnackbar();
          }
        });
      });
    } catch (error) {
      reject(error);
    }
  });
}
