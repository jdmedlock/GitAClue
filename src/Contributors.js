const GitHubInterface = require('./GitHubInterface.js');
const User = require('./User.js');

/**
 * @description Extract repo contributors from GitHub
 * @export
 * @class Contributors
 */
module.exports = class Contributors {

  /**
   * @description Creates an instance of the Contributor class.
   * @param {String} ownerName Name of the repository owner
   * @param {String} repoName Name of the repo
   * @memberof Contributors
   */
  constructor(ownerName, repoName) {
    if (ownerName === null || ownerName === undefined || typeof ownerName != 'string' ) {
      throw new Error(`Expected string value for ownerName parameter. Received: ${ownerName}`);
    }
    if (repoName === null || repoName === undefined || typeof repoName != 'string' ) {
      throw new Error(`Expected string value for repoName parameter. Received: ${repoName}`);
    }
    this.name = repoName;
    this.owner = ownerName;
    this.apiUrl = `https://api.github.com/repos/${ownerName}/${repoName}/contributors`;
    this.contributors = [];
  }

  /**
   * @description Retrieve repo contributors information from GitHub
   * @memberof Contributors
   */
  async fetchAllInfo() {
    const response = await GitHubInterface.fetchFromApi(this.apiUrl);
    for (let i = 0; i < response.data.length; i++) {
      const userObject = new User(response.data[i].login);
      await userObject.fetchInfo();
      this.contributors.push(userObject);
      }
  }
};
