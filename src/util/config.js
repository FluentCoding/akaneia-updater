import Store from "electron-store";

const schema = {
  vanillaIsoPath: {
    type: "string"
  },
  trackedIsos: {
    type: "array",
    properties: {
      name: {
        type: "string"
      },
      version: {
        type: "number"
      },
      destPath: {
        type: "string"
      },
      owner: {
        type: "string"
      },
      repo: {
        type: "string"
      },
      assetName: {
        type: "string"
      }
    }
  }
};

export default new Store({ schema });
