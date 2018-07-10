var deepDiff = require("deep-diff").diff;

var lhss = [{
    roles: ['administrator', 'developer'],
    sectors: ['health']
  },
  {
    roles: ['developer'],
    sectors: ['health']
  },
  {
    roles: ['administrator', 'developer'],
    sectors: ['kids']
  },
  {
    roles: ['developer', 'administrator'],
    sectors: ['kids']
  },
  {
    roles: ['administrator'],
    sectors: ['kids']
  },
  {
    roles: ['administrator', 'developer'],
    sectors: ['health', 'kids']
  },
  {
    roles: ['administrator'],
    sectors: ['kids', 'health']
  }
]

var rhs1 = {
  roles: ['administrator', 'developer'],
  sectors: ['kids']
};

for (var i = 0; i < lhss.length; ++i) {
  var lhs = lhss[i];
  var diff = deepDiff(lhs, rhs1);
  console.log('DIFF:', i, '\nLSH:', lhs, '\nRHS:', rhs1, '\nDIFF:', diff);
}

var tests = [
  { lhs: [1, 2, 3], rhs: [3, 2] },
  { lhs: [1, 2, 3], rhs: [3, 2] },
  { lhs: [1, 2, 3], rhs: [3, 2, 1] },
  { lhs: 'TEST STRING', rhs: 'STRING TEST' },
  { lhs: 'TEST STRING', rhs: 'TEST STRING' }
];

tests.forEach((test, i) => {
  var diff = deepDiff(test.lsh, test.rhs);
  console.log(
    '#### TEST', i, '####\n',
    'LHS:', test.lhs, '\n',
    'RHS:', test.rhs, '\n',
    'DIFF:', JSON.stringify(diff, null, 4)
  );
});
