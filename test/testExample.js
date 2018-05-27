const gitaclue = require('../gitaclue');

gitaclue.get([
  { context: 'repo', contextOwner: 'ShowMeCoders', contextName: 'showmecoders',
    segments: ['contributors'] },
  { context: 'user', contextOwner: '', contextName: 'jdmedlock' },
  { context: 'ratelimit' },
])
.then((response) => {
  console.log(`\nResponse from GitAClue.get(): ${response}`);
  const ghInfoObject = JSON.parse(response);
  console.log(`\nRepo name:${ghInfoObject[0].repo.name}`);
  console.log('...Contributors:');
  ghInfoObject[0].repo.contributors.forEach(element => {
    console.log(`......${element.name}`);
  });
  console.log(`\nUser name:${ghInfoObject[1].user.name}`);
})
.catch((error) => {
  console.log(error);
});
