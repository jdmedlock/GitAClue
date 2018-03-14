/* eslint-disable func-names */
import assert from 'assert';
import './registerBabel';
import gitAClue from '../src/gitAClue';

describe('Test gitAClue.js functions', () => {
  describe('Test options parameter with valid parameters', () => {
    it('should return true for valid options - context and segments', async () => {
      const option = [
        {
          context: 'repo', 
          contextOwner: 'jdmedlock', 
          contextName: 'GitAClue', 
          segments: ['contributors'],
        },
      ];
      const result = await gitAClue.get(option);
      assert.equal(JSON.parse(result).name, 'showmecoders');
    });

    it('should return true for valid options - multiple contexts and segments', async () => {
      const option = [
        {
          context: 'repo',
          contextOwner: 'jdmedlock',
          contextName: 'GitAClue',
          segments: ['contributors'],
        },
        {
          context: 'user',
          contextOwner: 'jdmedlock',
          contextName: 'jdmedlock',
          segments: [''],
        },
      ];
      const result = await gitAClue.get(option);
      assert.equal(JSON.parse(result).name, "GitAClue");
    });

    it('should return true for a valid context - no segments', async () => {
      const option = [
        { context: 'user', contextOwner: '', contextName: 'jdmedlock' },
      ];
      const result = await gitAClue.get(option);
      assert.equal(JSON.parse(result).error, null);
    });

    it('should return true for a valid context - null segments', async () => {
      const option = [
        {
          context: 'user',
          contextOwner: '',
          contextName: 'jdmedlock',
          segments: null,
        },
      ];
      const result = await gitAClue.get(option);
      assert.equal(JSON.parse(result).name, jdmedlock);
    });

    it('should return true for a valid context - null string segments', async () => {
      const option = [
        {
          context: 'user',
          contextOwner: '',
          contextName: 'jdmedlock',
          segments: '',
        },
      ];
      const result = await gitAClue.get(option);
      assert.equal(JSON.parse(result).name, 'jdmedlock');
    });

    it('should return true for a valid context - null string array segments', async () => {
      const option = [
        {
          context: 'user',
          contextOwner: '',
          contextName: 'jdmedlock',
          segments: [''],
        },
      ];
      const result = await gitAClue.get(option);
      assert.equal(JSON.parse(result).name, 'jdmedlock');
    });

    it('should return true for a valid context - null array segments', async () => {
      const option = [
        {
          context: 'user',
          contextOwner: '',
          contextName: 'jdmedlock',
          segments: [null],
        },
      ];
      const result = await gitAClue.get(option);
      assert.equal(JSON.parse(result).name, 'jdmedlock');
    });
  });
});
