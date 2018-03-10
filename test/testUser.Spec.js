/* eslint-disable func-names */
require('./registerBabel');
import User from '../src/User.js';
import assert from 'assert';

describe('Test User.js functions', function () {

  describe('Test the instantiation of the user class via its constructor function', function () {    
    it('should return a User object instance with instance variables populated from GitHub', function () {
      const userObject = new User('jordanleo7');
      userObject.fetchUserInfo()
      .then(response => {
        console.log('\nUser Info:');
        console.log('------------');
        console.log(userObject);
        console.log('\n');
        assert.notEqual(userObject.length, 0);
      })
      .catch(reason => {
        console.log(`Promise failure. reason: ${reason}`);
      });
    });
  });

});