/* eslint-disable func-names */
import assert from 'assert';
import './registerBabel';
import User from '../src/User';

describe('Test User.js functions', () => {

  describe('Test the instantiation of the user class via its constructor function', () => {    
    it('should return a User object instance with instance variables populated from GitHub', async () => {
      const userObject = new User('jordanleo7');
      await userObject.fetchInfo();
      console.log('\nUser Info:');
      console.log('------------');
      console.log(userObject);
      console.log('\n');
      assert.notEqual(userObject.length, 0);
    });
  });

});