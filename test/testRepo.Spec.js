/* eslint-disable func-names */
require('./registerBabel');
import Repo from '../src/Repo.js';
import assert from 'assert';

describe('Test Repo.js functions', function () {
  /**
   * Test the fetchFromApi() function
   */
  describe('Test the instantiation of the Repo class via its constructor function', async function () {    
    it('should return a Repo object instance with instance variables populated from GitHub', async function () {
      const repoObject = new Repo('chingu-voyage4', 'Bears-Team-1');
      await repoObject.fetchRepoInfo();
      console.log('\nRepo Info:');
      console.log('------------');
      console.log(repoObject);
      console.log('\n');
      assert.equal(repoObject.id, 121866033);
    });
  });

});