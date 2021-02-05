import fs from "fs";
import path from "path";
import fetch from "node-fetch";
import { execFile } from "child_process";
import isPackaged from "electron-is-packaged";
import { rootPath } from "electron-root-path";
import { remote } from "electron";
import getPlatform from "./getPlatform";
const app = remote.app;

const IS_PROD = process.env.NODE_ENV === "production";
const root = rootPath;
const { getAppPath } = app;

const binariesPath =
  IS_PROD && isPackaged
    ? path.join(path.dirname(getAppPath()), "..", "./Resources", "./bin")
    : path.join(root, "./resources", getPlatform(), "./bin");

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
      const assetPath = path.join(
        app.getPath("temp"),
        `${app.getName()}-${Date.now()}-${asset.name}`
      );

      res.arrayBuffer().then((deltaBuffer) => {
        return fs.writeFile(assetPath, new Uint8Array(deltaBuffer), (data) => {
          showInfo("Patching game...");
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
                    anchorOrigin: { horizontal: "right", vertical: "top" }
                  });
                } else {
                  enqueueSnackbar("Patch succeed!", {
                    variant: "success",
                    anchorOrigin: { horizontal: "right", vertical: "top" }
                  });
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
                }
                clear();
                resolve();
              }
            );
          } catch(error) {
            closeSnackbar();
          }
        });
      });
    } catch (error) {
      reject(error);
    }
  });
};
