import axios from 'axios';
import validator from 'validator';

export default class GitHubInterface {

  /**
   * @description Pass the supplied URL to Axios and return the JSON containing the results
   * @static
   * @param {String} apiUrl The GitHub API URL for the desired data
   * @returns {Object} A Promise which will be resolved with the response if successful
   * @memberof GitHubInterface
   */
  static async fetchFromApi(apiUrl) {
    if (!validator.isURL(apiUrl)) {
      throw new Error(`fetchFromAPI invalid apiUrl. apiUrl: ${apiUrl}`);
    }
    try {
      const response = await axios.get(apiUrl)
      console.log('axios result: ', response);
      return response;
    }
    catch (error) {
      if (error.response === undefined) {
        throw new Error(`Axios error. ${error}`);
      } else {
        throw new Error(`GitHub API rate limit exceeded. Status:${error.response.status} - ` +
          `${error.response.headers['x-ratelimit-remaining']} of ` +
          `${error.response.headers['x-ratelimit-limit']} remaining`);
      }
    }
  }
}
