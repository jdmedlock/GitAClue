/* eslint-disable func-names */
require('./registerBabel');
import GitHubInterface from '../src/GitHubInterface.js';
import assert from 'assert';

describe('Test GitHubIntf.js functions', function () {
  /**
   * Test the fetchFromApi() function
   */
  let repoContributors = [];
  describe('Test the fetchFromApi function', function () {    
    it('should return a JSON string containing all repo contributors', function () {
      GitHubInterface.fetchFromApi('https://api.github.com/repos/chingu-voyage4/Bears-Team-1/contributors')
      .then((response) => {
        repoContributors = response.data;
        // console.log('repoContributors: ', repoContributors);
        assert.equal(repoContributors[0].login, 'jordanleo7');
      });
    });
  });

});