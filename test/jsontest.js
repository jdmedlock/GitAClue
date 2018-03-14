
let jsonTarget = {};
let jsonSource1 = {
  name: 'fred',
  type: 'user',
};
let jsonSource2 = {
  name: 'wilma',
  type: 'user',
};

jsonTarget = Object.assign({}, { jsonSource1: jsonSource1});
console.log(`jsonTarget: ${JSON.stringify(jsonTarget,null,2)}`);
jsonTarget = Object.assign(jsonTarget, {jsonSource2: jsonSource2});
console.log(`jsonTarget: ${JSON.stringify(jsonTarget,null,2)}`); 

jsonTarget = Object.assign({}, { jsonSource1: jsonSource1});
const tag2 = 'newtag';
jsonTarget.jsonSource1[tag2] = jsonSource2;
console.log(`\n\njsonTarget: ${JSON.stringify(jsonTarget,null,2)}`); 
