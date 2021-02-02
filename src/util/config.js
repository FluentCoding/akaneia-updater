import Store from "electron-store";

const schema = {
  currentVersion: {
    type: "string",
  },
  githubRemoteUrl: {
    type: "string",
    default: "https://github.com/akaneia/akaneia-build/",
  },
  vanillaIsoPath: {
    type: "string",
  },
  modIsoPath: {
    type: "string",
  },
  destFolder: {
    type: "string",
  },
};

export default new Store({ schema });
