/* eslint-disable func-names */
require('./registerBabel');
import gitAClue from '../src/gitAClue.js';
import assert from 'assert';

describe('Test gitAClue.js functions', function () {
  describe('Test options parameter with valid parameters',
    async function () {    
    it('should return true for valid options - context and segments',
      async function () {
      const option = [
        {context: 'repo', contextName: 'jdmedlock', segments: ['contributors']}
      ]
      assert.equal(gitAClue.get(option), '');
    });

    it('should return true for valid options - multiple contexts and segments',
      async function () {
      const option = [
        {context: 'repo', contextName: 'jdmedlock', segments: ['contributors']},
        {context: 'user', contextName: 'jdmedlock', segments: ['']}
      ]
      assert.equal(gitAClue.get(option), '');
    });

    it('should return true for a valid context - no segments',
      async function () {
      const option = [
        {context: 'user', contextName: 'jdmedlock'}
      ];
      assert.equal(gitAClue.get(option), '');
    });

    it('should return true for a valid context - null segments',
      async function () {
      const option = [
        {context: 'user', contextName: 'jdmedlock', segments: null}
      ];
      assert.equal(gitAClue.get(option), '');
    });

    it('should return true for a valid context - null string segments',
      async function () {
      const option = [
        {context: 'user', contextName: 'jdmedlock', segments: ''}
      ];
      assert.equal(gitAClue.get(option), '');
    });

    it('should return true for a valid context - null string array segments',
      async function () {
      const option = [
        {context: 'user', contextName: 'jdmedlock', segments: ['']}
      ];
      assert.equal(gitAClue.get(option), '');
    });

    it('should return true for a valid context - null array segments',
      async function () {
      const option = [
        {context: 'user', contextName: 'jdmedlock', segments: [null]}
      ];
      assert.equal(gitAClue.get(option), '');
    });
  });

  describe('Test options parameter with invalid parameters',
  async function () {    
    it('should return false for invalid options - null option',
      async function () {
      const option = null;
      assert.equal(gitAClue.get(option), null);
    });
  });
});