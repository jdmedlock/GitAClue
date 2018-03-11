/* eslint-disable func-names */
require('./registerBabel');
import GitHubInterface from '../src/GitHubInterface.js';
import { assert, expect } from 'chai';

describe('Test GitHubIntf.js functions', async function () {
  /**
   * Test the fetchFromApi() function
   */
  const invalidApiUrl = 'xxxx:/api.github.com/repos/chingu-voyage4/Bears-Team-2/contributors';
  const validApiUrl = 'https://api.github.com/repos/chingu-voyage4/Bears-Team-2/contributors';
  let repoContributors = [];

  describe('Test the fetchFromApi function', async function () {

    // TODO: Research Mocha/Chai assertions against async functions. The following test is not
    // catching the error thrown by the fetchFromApi function.
    /*
    it('should throw an error for an invalid apiUrl parameter', () => {
      expect(async () => { 
        await GitHubInterface.fetchFromApi(invalidApiUrl)
        .then(response => console.log('returned from fetchFromApi'));
      }).to.throw(Error);
    });
    */

    it('should return a JSON string containing all repo contributors', async function () {
      GitHubInterface.fetchFromApi(validApiUrl)
      .then((response) => {
        repoContributors = response.data;
        assert.equal(repoContributors[0].login, 'jdmedlock');
      });
    });
  });

});