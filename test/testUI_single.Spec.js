/* eslint-disable func-names */
import assert from 'assert';
import './registerBabel';
import gitAClue from '../gitaclue';
import Organization from '../src/Organization.js';

describe('Test gitAClue.js functions', () => {
  describe('Test options parameter with valid parameters', () => {

    it('should return true for a valid context - repo/events', async () => {
      /*
      const option = [
        {
          context: 'repo',
          contextOwner: 'jdmedlock',
          contextName: 'GitAClue',
          segments: ['events'],
        },
      ];
      const result = await gitAClue.get(option);
      console.log('result: ', result);
      assert.equal(JSON.parse(result).error, undefined);
      assert.equal(JSON.parse(result).repo.owner, 'jdmedlock');
      assert.notEqual(JSON.parse(result).repo.events.length, 0, 'number of events > 0');
      */
      const option = [
        {
          context: 'organization',
          contextName: 'chingu-voyage4',
          segments: ['repolist'],
        },
      ];
      const result = await gitAClue.get(option);
      console.log('result: ', result);
      assert.equal(JSON.parse(result).error, undefined);
      assert.equal(JSON.parse(result)[0].orgObject.name, 'chingu-voyage4');
      assert.notEqual(JSON.parse(result)[0].repoList.length, 0, 'number of repos > 0');
    });
  });
});
