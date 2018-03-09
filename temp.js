const fs = require('fs');
var json = fs.readFileSync('./db/db.json').toString();
var keys = json.match(/(?:")(.*?)([^\\]"\:)/gi);
keys = Array.from(keys);
var duffKeys = [];
keys.forEach((key) => {
    if(key.match(/([$\.\/\[\]])/ig)){
        duffKeys.push(key);
    }
});

console.log(duffKeys);
