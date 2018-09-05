const dot = require('dot-object');

var results = [
  { id: 'abc123', name: 'Test doc 1' },
  { id: 'def234', name: 'Test doc 2' },
  { id: 'ghi345', name: 'Test doc 3' },
  { id: 'jkl456', name: 'Test doc 4' },
  { id: 'mno567', name: 'Test doc 5' },
  { id: 'pqr678', name: 'Test doc 6' },
  { id: 'tuv789', name: 'Test doc 7' }
];

var sortList = [
  'def234', 'jkl456', 'pqr678', 'abc123', 'ghi345'//, 'mno567', 'tuv789'
];

function sortByIndex(items, index, property) {
  var clone = JSON.parse(JSON.stringify(items));

  clone.sort((a, b) => {
    var prop1 = dot.pick(property, a);
    var prop2 = dot.pick(property, b);

    var ind1 = index.indexOf(prop1);
    var ind2 = index.indexOf(prop2);

    ind1 = ind1 > -1 ? ind1 : Math.max(items.length, index.length) + 1;
    ind2 = ind2 > -1 ? ind2 : Math.max(items.length, index.length) + 1;

    return ind1 - ind2;
  });

  return clone;
}

console.log('Sort list:', sortList);
console.log('Items:', results);

var sorted = sortByIndex(results, sortList, 'id');

console.log('Sorted:', sorted);
