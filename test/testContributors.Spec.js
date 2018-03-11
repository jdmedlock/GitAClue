/* eslint-disable func-names */
require('./registerBabel');
import Contributors from '../src/Contributors.js';
import assert from 'assert';

describe('Test Contributors.js functions', function () {
  /**
   * Test the fetchFromApi() function
   */
  describe('Test the instantiation of the Contributors class via its constructor function', function () {    
    it('should return a Contributors object instance with instance variables populated from GitHub', async function () {
      const contributorsObject = new Contributors('chingu-voyage4', 'Bears-Team-1');
      const result = await contributorsObject.fetchAllContributorsInfo();
      console.log('\nContributors Info:');
      console.log('--------------------');
      console.log(contributorsObject);
      console.log('\n');
      assert.notEqual(contributorsObject.length, 0);
    });
  });

});