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
          contextOwner: 'ShowMeCoders',
          contextName: 'showmecoders',
          segments: ['contributors'],
        },
      ];
      const result = await gitAClue.get(option)
      console.log('result: ', result);
      assert.equal(JSON.parse(result).name, 'showmecoders');
    });
  });
});
