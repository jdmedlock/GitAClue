import axios from 'axios';
import dotenv from 'dotenv';
import validator from 'validator';

export default class GitHubInterface {

/**
 * @description Pass the supplied URL to Axios and return the JSON containing the results
 * @static
 * @param {any} apiUrl The GitHub API URL for the desired data
 * @returns {[String]} A JSON object containing the results
 * @memberof GitHubInterface
 */
static async fetchFromApi(apiUrl) {
  if (!validator.isURL(apiUrl)) {
    console.log('I threw up');
    throw new Error(`fetchFromAPI invalid apiUrl. apiUrl: ${apiUrl}`);
  }
  dotenv.config();
  return await axios.get(apiUrl,
    {
      auth: {
        username: process.env.GITHUB_USERID,
        password: process.env.GITHUB_PASSWD
      }
    });
  }

}
