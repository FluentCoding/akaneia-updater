const Store = require('electron-store');

const schema = {
  currentVersion: {
    type: 'string'
  },
  githubRemoteUrl: {
    type: 'string',
    format: 'url'
  },
  vanillaIsoPath: {
    type: 'string'
  },
  isoFolderPath: {
    type: 'string'
  }
};

const store = new Store({schema});

export default store