const config = require('./config');

export default class packageManager {
    constructor() {
        this.config = config.get('githubRemoteUrl')
    }
}