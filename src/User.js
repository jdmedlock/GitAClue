import GitHubInterface from './GitHubInterface.js';

export default class User {

  /**
   * @description Creates an instance of the User class.
   * @param {String} ownerName Name of the repository owner
   * @param {String} repoName Name of the repo
   * @memberof User
   */
  constructor(loginName) {
    if (loginName === null || loginName === undefined || typeof loginName != 'string' ) {
      throw new Error(`Expected string value for ownerName parameter. Received: ${ownerName}`);
    }
    this.name = loginName;
    this.apiUrl = `https://api.github.com/users/${loginName}`;
  }

  /**
   * @description Retrieve information about a user from GitHub
   * @returns {Promise} A promise that will be fulfilled with the operation is complete.
   * @memberof User
   */
  async fetchUserInfo() {
    await GitHubInterface.fetchFromApi(this.apiUrl)
    .then(response => {
      this.id = response.data.id;
      this.name = response.data.login;
      this.avatar_url = response.data.avatar_url;
      this.html_url = response.data.html_url;
      this.type = response.data.type;
      this.location = response.data.location;
      this.email = response.data.email;
      this.bio = response.data.bio;
      this.publicRepos = response.data.publicRepos;
      this.followers = response.data.followers;
      this.following = response.data.following;
      this.created_at = response.data.created_at;
      this.updated_at = response.data.updated_at;
      return this;
    })
    .catch(reason => {
      throw new Error(`fetchUserInfo promise rejection. Reason: ${reason}`);
    });
  }
  
}
  