const gitaclue = require('../gitaclue');

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
  console.log(error);
});
