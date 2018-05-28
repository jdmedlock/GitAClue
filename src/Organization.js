const GitHubInterface = require('./GitHubInterface');

module.exports = class Organization {
  /**
   * @description Creates an instance of the Organization class.
   * @param {String} orgName Name of the organiztion
   * @memberof Organization
   */
  constructor(orgName) {
    if (orgName === null || orgName === undefined || typeof orgName !== 'string') {
      throw new Error(`Expected string value for orgName parameter. Received: ${orgName}`);
    }
    this.name = orgName;
    this.apiUrl = `https://api.github.com/orgs/${orgName}`;
  }

  /**
   * @description Retrieve information about an Organization from GitHub
   * @returns {Boolean} True if the information was successfully retrieved.
   * @memberof Organization
   */
  async fetchInfo() {
    const response = await GitHubInterface.fetchFromApi(this.apiUrl);
    this.id = response.data.id;
    this.full_name = response.data.full_name;
    this.title = response.data.name;
    this.type = response.data.type;
    this.repos_url = response.data.repos_url;
    this.members_url = response.data.members_url;
    this.created_at = response.data.created_at;
    this.updated_at = response.data.updated_at;
    return true;
  }

  /**
   * @description Retrieve a list of repo names associated with this repo
   * @returns {Object[]} Array of objects whose entries contain the owner and
   * name of each repo associated with this Organization.
   */
  async getRepoList() {
    const response = await GitHubInterface.fetchFromApi(this.repos_url);
    return response.data.map((element) => {
      return {owner: element.owner.login, repoName: element.name};
    }, []);
  }
};
