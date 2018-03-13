import GitHubInterface from './GitHubInterface';

/**
 * @description Extract Repo information from GitHub
 * @export
 * @class Repo
 */
export default class Repo {
  /**
   * @description Creates an instance of the Repo class.
   * @param {String} ownerName Name of the repository owner
   * @param {String} repoName Name of the repo
   * @memberof Repo
   */
  constructor(ownerName, repoName) {
    if (ownerName === null || ownerName === undefined || typeof ownerName !== 'string') {
      throw new Error(`Expected string value for ownerName parameter. Received: ${ownerName}`);
    }
    if (repoName === null || repoName === undefined || typeof repoName !== 'string') {
      throw new Error(`Expected string value for repoName parameter. Received: ${repoName}`);
    }
    this.name = repoName;
    this.owner = ownerName;
    this.apiUrl = `https://api.github.com/repos/${ownerName}/${repoName}`;
  }

  /**
   * @description Retrieve repo information from GitHub
   * @memberof Repo
   */
  async fetchRepoInfo() {
    console.log('fetchRepoInfo - before fetchFromAPI');
    const response = await GitHubInterface.fetchFromApi(this.apiUrl);
    console.log('fetchRepoInfo - after fetchFromAPI');
    this.id = response.data.id;
    this.description = response.data.description;
    this.html_url = response.data.html_url;
    this.private = response.data.private;
    this.forked = response.data.fork;
    this.cloned = !response.data.fork;
    this.created_at = response.data.created_at;
    this.updated_at = response.data.updated_at;
    this.pushed_at = response.data.pushed_at;
    this.noStars = response.data.stargazers_count;
    this.noWatchers = response.data.watchers_count;
    this.language = response.data.language;
    this.license = response.data.license;
    this.noForks = response.data.forks_count;
    return response.data;
  }
}
