import GitHubInterface from './GitHubInterface.js';
import User from './User.js';

export default class Contributors {

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
   * @returns {Promise} A promise that will be fulfilled with the operation is complete.
   * @memberof Contributors
   */
  async fetchAllContributorsInfo() {
    await GitHubInterface.fetchFromApi(this.apiUrl)
    .then(response => {
      response.data.forEach(element => {
        console.log(`Processing contributing user: ${element.login}`);
        const userObject = new User(element.login);
        this.contributors.push(userObject);
        userObject.fetchUserInfo()
        .then(() => {
          console.log(`Finished fetching user`);
        });
      });
    })
    .catch(reason => {
      throw new Error(`fetchContributorsInfo promise rejection. Reason: ${reason}`);
    });

    return true;
  }

}
  