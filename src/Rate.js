const GitHubInterface = require('./GitHubInterface');

/**
 * @description Extract Rate information from GitHub
 * @export
 * @class Rate
 */
module.exports = class Rate {
  /**
   * @description Creates an instance of the Rate class.
   * @memberof Repo
   */
  constructor(ownerName, repoName) {
    this.apiUrl = `https://api.github.com/rate_limit`;
  }

  /**
   * @description Retrieve rate limit information from GitHub
   * @memberof Rate
   */
  async fetchInfo() {
    const response = await GitHubInterface.fetchFromApi(this.apiUrl);
    this.limit = response.data.rate.limit;
    this.remaining = response.data.rate.remaining;
    return response.data;
  }
};
