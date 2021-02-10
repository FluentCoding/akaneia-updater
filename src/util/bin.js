import { remote } from "electron";
import isDev from "electron-is-dev";
import isPackaged from "electron-is-packaged";
import path from "path";

import { getPlatform } from "./platform";

const app = remote.app;

function getBinPath(name) {
  return !isDev && isPackaged
    ? path.resolve(
        path.join(
          path.dirname(app.getAppPath()),
          "..",
          "Resources",
          "bin",
          name
        )
      )
    : path.resolve(
        path.join(app.getAppPath(), "resources", getPlatform(), name)
      );
}

export { getBinPath };
