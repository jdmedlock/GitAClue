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
      ];
      assert.equal(gitAClue.get(option).error, null);
    });

    it('should return true for valid options - multiple contexts and segments',
      async function () {
      const option = [
        {context: 'repo', contextName: 'jdmedlock', segments: ['contributors']},
        {context: 'user', contextName: 'jdmedlock', segments: ['']}
      ];
      assert.equal(gitAClue.get(option).error, null);
    });

    it('should return true for a valid context - no segments',
      async function () {
      const option = [
        {context: 'user', contextName: 'jdmedlock'}
      ];
      assert.equal(gitAClue.get(option).error, null);
    });

    it('should return true for a valid context - null segments',
      async function () {
      const option = [
        {context: 'user', contextName: 'jdmedlock', segments: null}
      ];
      assert.equal(gitAClue.get(option).error, null);
    });

    it('should return true for a valid context - null string segments',
      async function () {
      const option = [
        {context: 'user', contextName: 'jdmedlock', segments: ''}
      ];
      assert.equal(gitAClue.get(option).error, null);
    });

    it('should return true for a valid context - null string array segments',
      async function () {
      const option = [
        {context: 'user', contextName: 'jdmedlock', segments: ['']}
      ];
      assert.equal(gitAClue.get(option).error, null);
    });

    it('should return true for a valid context - null array segments',
      async function () {
      const option = [
        {context: 'user', contextName: 'jdmedlock', segments: [null]}
      ];
      assert.equal(gitAClue.get(option).error, null);
    });
  });

  describe('Test options parameter with invalid parameters',
  async function () {    
    it('should return false for invalid options - null option',
      async function () {
      const option = null;
      assert.equal(gitAClue.get(option).error, 'option parameter is null, undefined, or not an object');
    });

    it('should return false for invalid options - missing context keyword',
      async function () {
      const option = [
        {contextName: 'jdmedlock', segments: ['contributors']}
      ];
      assert.equal(gitAClue.get(option).error, 'context is null, undefined, or not a string');
    });

    it('should return false for invalid options - unknown context keyword',
      async function () {
      const option = [
        {context: 'fred', contextName: 'jdmedlock', segments: ['contributors']}
      ];
      assert.equal(gitAClue.get(option).error, 'unknown context specified');
    });

    it('should return false for invalid options - missing contextName keyword',
      async function () {
      const option = [
        {context: 'repo', segments: ['contributors']}
      ];
      assert.equal(gitAClue.get(option).error, 'contextName is null, undefined, or not a string');
    });

    it('should return false for invalid options - invalid segment name',
      async function () {
      const option = [
        {context: 'repo', contextName: 'jdmedlock', segments: ['gandalf']}
      ];
      assert.equal(gitAClue.get(option).error, 'segments contains one or more invalid entries');
    });

  });
});