/* eslint-disable func-names */
require('./registerBabel');

import User from '../src/User.js';
import assert from 'assert';

describe('Test User.js functions', async function () {

  describe('Test the instantiation of the user class via its constructor function', async function () {    
    it('should return a User object instance with instance variables populated from GitHub', async function () {
      const userObject = new User('jordanleo7');
      await userObject.fetchUserInfo();
      console.log('\nUser Info:');
      console.log('------------');
      console.log(userObject);
      console.log('\n');
      assert.notEqual(userObject.length, 0);
    });
  });

});