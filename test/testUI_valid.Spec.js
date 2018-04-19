/* eslint-disable func-names */
import assert from 'assert';
import './registerBabel';
import gitAClue from '../gitaclue';

describe('Test gitAClue.js functions', () => {
  describe('Test options parameter with valid parameters', () => {

    it('should return true for valid options - rate limit of 5000',
      async () => {
      const option = [
        {
          context: 'ratelimit',
        },
      ];
      const result = await gitAClue.get(option);
      assert.equal(JSON.parse(result).error, undefined);
      assert.equal(JSON.parse(result)[0].rate.limit, 5000);
    });

    it('should return true for valid options - context and segments',
      async () => {
      const option = [
        {
          context: 'repo',
          contextOwner: 'jdmedlock',
          contextName: 'GitAClue',
          segments: ['contributors'],
        },
      ];
      const result = await gitAClue.get(option);
      assert.equal(JSON.parse(result).error, undefined);
      assert.equal(JSON.parse(result)[0].repo.name, 'GitAClue');
    });

    it('should return true for valid options - multiple contexts and segments',
      async () => {
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
      assert.equal(JSON.parse(result).error, undefined);
      assert.equal(JSON.parse(result)[0].repo.name, 'GitAClue');
      assert.equal(JSON.parse(result)[1].user.name, 'jdmedlock');
    });

    it('should return true for a valid context - repo/events', async () => {
      const option = [
        {
          context: 'repo',
          contextOwner: 'jdmedlock',
          contextName: 'GitAClue',
          segments: ['events'],
        },
      ];
      const result = await gitAClue.get(option);
      assert.equal(JSON.parse(result).error, undefined);
      assert.equal(JSON.parse(result)[0].repo.name, 'GitAClue');
      assert.equal(JSON.parse(result)[0].repo.owner, 'jdmedlock');
      assert.notEqual(JSON.parse(result)[0].repo.events.length, 0, 'number of events > 0');
    });

    it('should return true for a valid context - no segments', async () => {
      const option = [
        { context: 'user', contextOwner: '', contextName: 'jdmedlock' },
      ];
      const result = await gitAClue.get(option);
      assert.equal(JSON.parse(result).error, undefined);
      assert.equal(JSON.parse(result)[0].user.name, 'jdmedlock');
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
      assert.equal(JSON.parse(result).error, undefined);
      assert.equal(JSON.parse(result)[0].user.name, 'jdmedlock');
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
      assert.equal(JSON.parse(result).error, undefined);
      assert.equal(JSON.parse(result)[0].user.name, 'jdmedlock');
    });

    it('should return true for a valid context - null string array segments',
      async () => {
      const option = [
        {
          context: 'user',
          contextOwner: '',
          contextName: 'jdmedlock',
          segments: [''],
        },
      ];
      const result = await gitAClue.get(option);
      assert.equal(JSON.parse(result).error, undefined);
      assert.equal(JSON.parse(result)[0].user.name, 'jdmedlock');
    });

    it('should return true for a valid context - null array segments',
      async () => {
      const option = [
        {
          context: 'user',
          contextOwner: '',
          contextName: 'jdmedlock',
          segments: [null],
        },
      ];
      const result = await gitAClue.get(option);
      assert.equal(JSON.parse(result).error, undefined);
      assert.equal(JSON.parse(result)[0].user.name, 'jdmedlock');
    });

    it('should return true for a valid context - 2 repos/1 user', async () => {
      const option = [
        {
          context: 'repo',
          contextOwner: 'jdmedlock',
          contextName: 'voyageevents',
        },
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
      assert.equal(JSON.parse(result).error, undefined);
      assert.equal(JSON.parse(result)[0].repo.name, 'voyageevents');
      assert.equal(JSON.parse(result)[1].repo.name, 'GitAClue');
      assert.equal(JSON.parse(result)[2].user.name, 'jdmedlock');
    });

  });
});
