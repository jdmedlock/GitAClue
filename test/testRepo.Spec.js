/* eslint-disable func-names */
import assert from 'assert';
import './registerBabel';
import Repo from '../src/Repo';

describe('Test Repo.js functions', function () {
  describe('Test the instantiation of the Repo class via its constructor function', () => {    
    it('should return a Repo object instance with instance variables populated from GitHub', async () => {
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