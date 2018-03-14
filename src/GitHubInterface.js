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
  static fetchFromApi(apiUrl) {
    if (!validator.isURL(apiUrl)) {
      throw new Error(`fetchFromAPI invalid apiUrl. apiUrl: ${apiUrl}`);
    }
    let result = null;
    return new Promise(function (resolve, reject) {
      try {
        result = axios.get(apiUrl);
        resolve(result);
      }
      catch (error) {
        if (error.response === undefined) {
          console.log('axios error: ', error);
        } else {
          console.log('Status: ', error.response.status);
          console.log(error.response.data.message);
          console.log(`GitHub API rate remaining/limit: ${error.response.headers['x-ratelimit-remaining']}/${error.response.headers['x-ratelimit-limit']}`);
        }
        reject(error);
      };
    });
  }
}
