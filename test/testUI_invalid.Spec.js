/* eslint-disable func-names */
import assert from 'assert';
import './registerBabel';
import gitAClue from '../gitaclue';

describe('Test gitAClue.js functions', () => {
  describe('Test options parameter with invalid parameters', () => {
    it('should return false for invalid options - null option', async () => {
      const option = null;
      const result = await gitAClue.get(option);
      assert.equal(JSON.parse(result).error, 'option parameter is null, undefined, or not an object');
    });

    it('should return false for invalid options - missing context keyword', async () => {
      const option = [
        { contextName: 'GitAClue', contextOwner: 'jdmedlock', segments: ['contributors'] },
      ];
      const result = await gitAClue.get(option);
      assert.equal(JSON.parse(result).error, 'context is null, undefined, or not a string');
    });

    it('should return false for invalid options - unknown context keyword', async () => {
      const option = [
        {
          context: 'fred',
          contextOwner: 'jdmedlock',
          contextName: 'GitAClue',
          segments: ['contributors'],
        },
      ];
      const result = await gitAClue.get(option);
      assert.equal(JSON.parse(result).error, 'unknown context specified');
    });

    it('should return false for invalid options - missing contextOwner keyword', async () => {
      const option = [
        { context: 'repo', contextName: 'GitAClue', segments: ['contributors'] },
      ];
      const result = await gitAClue.get(option);
      assert.equal(JSON.parse(result).error, 'contextOwner is null, undefined, or not a string');
    });

    it('should return false for invalid options - missing contextName keyword', async () => {
      const option = [
        { context: 'repo', contextOwner: 'jdmedlock', segments: ['contributors'] },
      ];
      const result = await gitAClue.get(option);
      assert.equal(JSON.parse(result).error, 'contextName is null, undefined, or not a string');
    });

    it('should return false for invalid options - invalid segment name', async () => {
      const option = [
        {
          context: 'repo',
          contextOwner: 'jdmedlock',
          contextName: 'GitAClue',
          segments: ['gandalf'],
        },
      ];
      const result = await gitAClue.get(option);
      assert.equal(JSON.parse(result).error, 'segments contains one or more invalid entries');
    });
  });
});
