const axios = require('axios');
const validator = require('validator');

module.exports = class GitHubInterface {

  /**
   * @description Pass the supplied URL to Axios and return the JSON containing
   * the results. Basic authentication using a generic GitHub 'service' account
   * is used to ensure that extended rate limits are used rather than the basic
   * limit of 60/hour.
   * @static
   * @param {String} apiUrl The GitHub API URL for the desired data
   * @returns {Object} A Promise which will be resolved with the response if
   * successful
   * @memberof GitHubInterface
   */
  static async fetchFromApi(apiUrl) {
    if (!validator.isURL(apiUrl)) {
      throw new Error(`fetchFromAPI invalid apiUrl. apiUrl: ${apiUrl}`);
    }
    try {
      const response = await axios({
        method: 'get',
        url: apiUrl,
        headers: { 'Authorization': 'Bearer ca72873ab79a7c8a53c768853d91b74bad1b62e9' }
      })
      return response;
    }
    catch (error) {
      if (error.response === undefined) {
        throw new Error(`Axios error. ${error}`);
      } else {
        throw new Error(`GitHub API rate limit exceeded - ` +
          `${error.response.headers['x-ratelimit-remaining']} of ` +
          `${error.response.headers['x-ratelimit-limit']} remaining. ` +
          `Status:${error.response.status}`);
      }
    }
  }
};
