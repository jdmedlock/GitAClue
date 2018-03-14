const gitaclue = require('../src/GitAClue');

gitaclue.get([
  { context: 'repo', contextOwner: 'ShowMeCoders', contextName: 'showmecoders', 
    segments: ['contributors'] },
  { context: 'user', contextOwner: '', contextName: 'jdmedlock' },
])
.then((response) => {
  console.log(`\nResponse from GitAClue.get(): ${response}`);
  const ghInfoObject = JSON.parse(response);
  console.log(`\nRepo name:${ghInfoObject.repo.name}`);
})
.catch((error) => {
  console.log('An error occurred. error=', error);
});

