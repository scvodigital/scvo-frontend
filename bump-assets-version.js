const fs = require('fs');

console.log('Updating local site\'s assetVersion number');
console.log('Fetching assets package.json file');
const assetsPackage = require('../assets/package.json');
const versionNo = assetsPackage.version;

console.log('Current assetsVersion number is', versionNo);
console.log('Loading compiled sites JSON');
const sites = require('./sites/sites.json');

for (const [name, config] of Object.entries(sites)) {
  console.log('Updating metadata for', name);
  config.metaData.assetsVersion = versionNo;
}

const sitesJson = JSON.stringify(sites, null, 2);
console.log('Writing updated sites.json');
fs.writeFileSync('./sites/sites.json', sitesJson);
console.log('All done');
