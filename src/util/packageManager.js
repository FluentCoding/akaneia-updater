export default class packageManager {
  constructor() {
    this.remote = "https://api.github.com/repos/akaneia/akaneia-build/releases"
    this.version = "0.51"
  }

  async getReleaseInfo() {
    const headers = new Headers({
      "Accept": "application/vnd.github.v3+json"
    })
    return fetch(this.remote, headers).then(response => response);
  }
}