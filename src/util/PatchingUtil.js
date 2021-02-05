import fs from "fs";
import fetch from "node-fetch";

export const patchROM = (
  asset,
  isoFile,
  destFile,
  version,
  clear,
  store,
  enqueueSnackbar,
  closeSnackbar,
  index
) => {
  if (!asset) return "Error";

  if (!isoFile) isoFile = store.get("vanillaIsoPath");

  var lastSnackbar = undefined;
  const showInfo = (message) =>
    enqueueSnackbar &&
    enqueueSnackbar(message, {
      variant: "info",
      autoHideDuration: null,
      anchorOrigin: { horizontal: "right", vertical: "top" },
      action: (key) => {
        lastSnackbar = key;
      },
    });

  return new Promise(async (resolve, reject) => {
    try {
      showInfo("Downloading patch file...");
      const res = await fetch(asset.downloadUrl, {
        redirect: "follow",
        headers: {
          "Content-Type": "application/octet-stream",
        },
      });
      showInfo("Reading patch file...");
      res.arrayBuffer().then((deltaBuffer) => {
        showInfo("Reading game file...");
        fs.readFile(isoFile, (err, isoFileBuffer) => {
          showInfo("Patching the game...");
          let worker = new Worker("./worker.js");

          worker.addEventListener("message", (e) => {
            showInfo("Writing into new game file...");
            try {
              fs.writeFile(destFile, new Uint8Array(e.data), () => {
                console.log(asset.downloadUrl);
                console.log(deltaBuffer);
                console.log(isoFileBuffer);
                console.log(e.data);
                // store into config
                let trackedIsos = store.get("trackedIsos", []);
                const newTrackedIso = {
                  name: "Akaneia Build",
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

                clear && clear();
                closeSnackbar && closeSnackbar(lastSnackbar);
                enqueueSnackbar &&
                  enqueueSnackbar("All steps completed!", {
                    variant: "success",
                    anchorOrigin: { horizontal: "right", vertical: "top" },
                  });
                resolve();
              });
            } catch (error) {
              reject(error);
            }
          });

          worker.postMessage({
            deltaBuffer: deltaBuffer,
            isoFileBuffer: isoFileBuffer,
          });
        });
      });
    } catch (error) {
      reject(error);
    }
  });
};
