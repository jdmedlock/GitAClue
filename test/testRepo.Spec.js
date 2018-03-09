/* eslint-disable func-names */
require('./registerBabel');
import Repo from '../src/Repo.js';
import assert from 'assert';

describe('Test Repo.js functions', function () {
  /**
   * Test the fetchFromApi() function
   */
  describe('Test the instantiation of the Repo class via its constructor function', function () {    
    it('should return a Repo object instance with instance variables populated from GitHub', function () {
      const repoObject = new Repo('chingu-voyage4', 'Bears-Team-1');
      repoObject.fetchRepoInfo()
      .then(response => {
        // console.log(repoObject);
        console.log('\nRepo Info:');
        console.log('---------');
        console.log(repoObject);
        console.log('\n');
        assert.equal(repoObject.id, 121866033);
      })
      .catch(reason => {
        console.log(`Promise failure. reason: ${reason}`);
      });
    });
  });

});