/* eslint-disable func-names */
import assert from 'assert';
import './registerBabel';
import gitAClue from '../gitaclue';

describe('Test gitAClue.js functions', () => {
  describe('Test options parameter with valid parameters', () => {
    it('should return true for valid options - context and segments', async () => {
      const option = [
        {
          context: 'user',
          contextName: 'jdmedlock'
        },
      ];
      const result = await gitAClue.get(option)
      console.log('result: ', result);
      assert.equal(JSON.parse(result).repo.name, 'showmecoders');
    });
  });
});
