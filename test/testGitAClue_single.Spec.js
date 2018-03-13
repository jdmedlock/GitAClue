/* eslint-disable func-names */
import assert from 'assert';
import './registerBabel';
import gitAClue from '../src/gitAClue';

describe('Test gitAClue.js functions', () => {
  describe('Test options parameter with valid parameters', () => {
    it('should return true for valid options - context and segments',  () => {
      const option = [
        {
          context: 'repo',
          contextOwner: 'jdmedlock',
          contextName: 'GitAClue',
          segments: ['contributors'],
        },
      ];
      const result = gitAClue.get(option)
      console.log('result: ', result);
      assert.equal(result.name, 'GitAClue');
    });
  });
});
