const fs = require('fs');
const pa = require('path');

const dot = require('dot-object');
const chalk = require('chalk');

if(process.argv.length < 2){
    console.log('Nae directory gi\'en');
    process.exit();
}

var input = process.argv.slice(2);
var output = input.pop();
    
const re = {
    stringImport: /(?:"\{\$)(.*?)(?:\}")/ig,
    jsonImport: /(?:"\{\:)(.*?)(@.+?)?(?:\}")(: ?"")?/ig,
};
const importCache = {};

getFiles();

function getFiles(){
    try{
        console.log(chalk.bgBlue.black.bold('JSON2 Transpiler'));
        console.log(chalk.blue(chalk.bold('Input:'), input));
        console.log(chalk.blue(chalk.bold('Output:'), output));

        var outputDir = pa.join(__dirname, output);
        if(!fs.existsSync(outputDir)){
            console.log(chalk.yellow('Output directory', chalk.underline(outputDir), 'does not exists. Creating it...'));
            fs.mkdirSync(outputDir);
            console.log(chalk.yellow('Output directory created'));
        }

        input.forEach((file) => {
            if(file.indexOf('.json2') === file.length - 6){
                processFile(file);
            }
        });
    }catch(err){
        console.error('JSON2 Error:', err);
    }
}

function processFile(path){
    console.log(chalk.bgBlue.black.bold('####### Processing:', path));

    var before = fs.readFileSync(path).toString();
    var after = before;

    var basedir = pa.dirname(path);

    //import external strings
    var stringImports = after.match(re.stringImport) || [];
    console.log(chalk.blueBright(chalk.bold('\tString Imports:'), stringImports.length));
    var after = after.replace(re.stringImport, (all, match) => {
        var fullImportPath = pa.join(basedir, match);
        //check to see if we have already read this file
        if(!importCache.hasOwnProperty(fullImportPath)){
            //if not, load it into our import cache
            importCache[fullImportPath] = fs.readFileSync(fullImportPath).toString();
        }
        
        var jsonSafe = JSON.stringify(importCache[fullImportPath]);

        return jsonSafe;
    });
    
    var jsonImports = after.match(re.jsonImport) || [];
    console.log(chalk.blueBright(chalk.bold('\tJSON Imports:'), jsonImports.length));
    var after = after.replace(re.jsonImport, (all, match, match2, match3) => {
        var fullImportPath = pa.join(basedir, match);
        //check to see if we have already read this file
        if(!importCache.hasOwnProperty(fullImportPath)){
            //if not, load it into our import cache
            importCache[fullImportPath] = fs.readFileSync(fullImportPath).toString();
        }
        
        var obj = JSON.parse(importCache[fullImportPath]);

        if (match2) {
            match2 = match2.substr(1);
            obj = dot.pick(match2, obj);
        }

        var json = JSON.stringify(obj, null, 4);

        if (match3) {
            var lines = json.split(/\n/ig);
            lines.shift();
            lines.pop();
            json = lines.join('\n');
        }

        return json;
    });
    
    var fileName = pa.parse(path).base;
    fileName = fileName.substr(0, fileName.length - 1);
    var newPath = pa.join(__dirname, output, fileName);

    try{
        //final fixings
        var parsed = JSON.parse(after);
        var json = JSON.stringify(parsed, null, 4);

        fs.writeFileSync(newPath, json);

        console.log(chalk.green(chalk.bold('\tProcessed:'), newPath));
    }catch(err){
        var positionMatch = err.message.match(/(?:position\s)(\d+)/);
        var position = positionMatch ? positionMatch[1] : null;
        var lines = after.split('\n');
        var debug = [];
        var totalChars = 0;
        var lineNo = 0;
        var colNo = 0;

        lines.forEach((line, number) => {
            var lineNoString = parseInt(number + 1) + ': ';
            if(position){
                var lineLength = line.length;
                if(position >= totalChars && position < totalChars + line.length){
                    var linePosition = position - totalChars;
                    var offset = lineNoString.length;
                    colNo = offset;
                    var spaces = Array(linePosition + offset).join(' ');
                    debug.push(spaces + '^ ' + err.message);
                    lineNo = number;
                }
            }
            
            debug.push(lineNoString + line);
            totalChars += line.length;
        });

        debug = debug.splice(lineNo - 5, 10);
        console.error(chalk.bgRed.black.bold('There was a problem with the final JSON'));
        console.error(chalk.red.bold(err));
        console.error(chalk.gray(debug.join('\n')));
        console.error(chalk.red.bold('File:', newPath + '.broken'));
        console.error(chalk.red.bold('Line No:', lineNo));
        console.error(chalk.red.bold('Column No:', colNo));
        console.error(chalk.red.bold(err));

        fs.writeFileSync(newPath + '.broken', after);
    }
}

