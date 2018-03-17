/* eslint-disable func-names */
import assert from 'assert';
import './registerBabel';
import gitAClue from '../gitaclue';

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
      assert.equal(JSON.parse(result).repo.name, 'GitAClue');
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
          contextName: 'jdmedlock',
          segments: [''],
        },
      ];
      const result = await gitAClue.get(option);
      assert.equal(JSON.parse(result).repo.name, 'GitAClue');
      assert.equal(JSON.parse(result).user.name, 'jdmedlock');
    });
  });
});
