/* eslint-disable func-names */
import assert from 'assert';
import './registerBabel';
import gitAClue from '../src/gitAClue';

describe('Test gitAClue.js functions', () => {
  describe('Test options parameter with valid parameters', () => {
    it('should return true for valid options - context and segments', () => {
      const option = [
        {
          context: 'repo', contextOwner: 'jdmedlock', contextName: 'jdmedlock', segments: ['contributors'],
        },
      ];
      assert.equal(gitAClue.get(option).error, null);
    });

    it('should return true for valid options - multiple contexts and segments', () => {
      const option = [
        {
          context: 'repo',
          contextOwner: 'jdmedlock',
          contextName: 'jdmedlock',
          segments: ['contributors'],
        },
        {
          context: 'user',
          contextOwner: 'jdmedlock',
          contextName: 'jdmedlock',
          segments: [''],
        },
      ];
      assert.equal(gitAClue.get(option).error, null);
    });

    it('should return true for a valid context - no segments', () => {
      const option = [
        { context: 'user', contextOwner: 'jdmedlock', contextName: 'jdmedlock' },
      ];
      assert.equal(gitAClue.get(option).error, null);
    });

    it('should return true for a valid context - null segments', () => {
      const option = [
        {
          context: 'user',
          contextOwner: 'jdmedlock',
          contextName: 'jdmedlock',
          segments: null,
        },
      ];
      assert.equal(gitAClue.get(option).error, null);
    });

    it('should return true for a valid context - null string segments', () => {
      const option = [
        {
          context: 'user',
          contextOwner: 'jdmedlock',
          contextName: 'jdmedlock',
          segments: '',
        },
      ];
      assert.equal(gitAClue.get(option).error, null);
    });

    it('should return true for a valid context - null string array segments', () => {
      const option = [
        {
          context: 'user',
          contextOwner: 'jdmedlock',
          contextName: 'jdmedlock',
          segments: [''],
        },
      ];
      assert.equal(gitAClue.get(option).error, null);
    });

    it('should return true for a valid context - null array segments', () => {
      const option = [
        {
          context: 'user',
          contextOwner: 'jdmedlock',
          contextName: 'jdmedlock',
          segments: [null],
        },
      ];
      assert.equal(gitAClue.get(option).error, null);
    });
  });

  describe('Test options parameter with invalid parameters', () => {
    it('should return false for invalid options - null option', () => {
      const option = null;
      assert.equal(gitAClue.get(option).error, 'option parameter is null, undefined, or not an object');
    });

    it('should return false for invalid options - missing context keyword', () => {
      const option = [
        { contextName: 'jdmedlock', contextOwner: 'jdmedlock', segments: ['contributors'] },
      ];
      assert.equal(gitAClue.get(option).error, 'context is null, undefined, or not a string');
    });

    it('should return false for invalid options - unknown context keyword', () => {
      const option = [
        {
          context: 'fred',
          contextOwner: 'jdmedlock',
          contextName: 'jdmedlock',
          segments: ['contributors'],
        },
      ];
      assert.equal(gitAClue.get(option).error, 'unknown context specified');
    });

    it('should return false for invalid options - missing contextOwner keyword', () => {
      const option = [
        { context: 'repo', contextName: 'jdmedlock', segments: ['contributors'] },
      ];
      assert.equal(gitAClue.get(option).error, 'contextOwner is null, undefined, or not a string');
    });

    it('should return false for invalid options - missing contextName keyword', () => {
      const option = [
        { context: 'repo', contextOwner: 'jdmedlock', segments: ['contributors'] },
      ];
      assert.equal(gitAClue.get(option).error, 'contextName is null, undefined, or not a string');
    });

    it('should return false for invalid options - invalid segment name', () => {
      const option = [
        {
          context: 'repo',
          contextOwner: 'jdmedlock',
          contextName: 'jdmedlock',
          segments: ['gandalf'],
        },
      ];
      assert.equal(gitAClue.get(option).error, 'segments contains one or more invalid entries');
    });
  });
});
