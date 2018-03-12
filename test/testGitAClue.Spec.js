/* eslint-disable func-names */
require('./registerBabel');
import gitAClue from '../src/gitAClue.js';
import assert from 'assert';

describe('Test gitAClue.js functions', function () {
  describe('Test options parameter validation',
    async function () {    
    it('should return true for valid options with context and segments',
      async function () {
      const option = [
        {context: 'repo', contextName: 'jdmedlock', segments: 'contributors'}
      ]
      assert.equal(gitAClue.validateOptions(option), true);
    });

    it('should return true for valid options with no segments',
      async function () {
      const option = [
        {context: 'user', contextName: 'jdmedlock', segments: ''}
      ]
      assert.equal(gitAClue.validateOptions(option), true);
    });
  });
});