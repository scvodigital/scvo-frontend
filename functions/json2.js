const fs = require('fs');
const pa = require('path');

const dot = require('dot-object');
const chalk = require('chalk');

if(process.argv.length < 2){
    console.log('Nae directory gi\'en');
    process.exit();
}

var input = process.argv.slice(2);
var output = input.pop();;
    
const re = {
    blockComment: /(\/\*(?:.|[\r\n])*?\*\/)/igm,
    fancyStrings: /(\`(?:.|[\r\n])*?\`)/igm,
    trailingComma: /(\,)(\s+)(\}|\])/igm,
    fileImport: /(?:\{\:)(.*?)(?:\})/ig,
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

    //import external content
    var fileImports = after.match(re.fileImport) || [];
    console.log(chalk.blueBright(chalk.bold('\tImports:'), fileImports.length));
    var after = after.replace(re.fileImport, (all, match) => {
        //split apart our import path and potention object path
        var parts = match.split('|');
        var importPath = parts[0];

        var fullImportPath = pa.join(basedir, importPath);
        //check to see if we have already read this file
        if(!importCache.hasOwnProperty(fullImportPath)){
            //if not, load it into our import cache
            importCache[fullImportPath] = fs.readFileSync(fullImportPath).toString();
        }
        
        //check if we have a second parameter (object path)
        if(parts.length > 1){
            //if we do then we treat the object as json
            try{
                var objectPath = parts[1];
                var json = JSON.parse(importCache[fullImportPath]);

                //and extract the value from the given object path
                var value = dot.pick(objectPath, json);
                return JSON.stringify(value, null, 4);
            }catch(err){
                console.error(chalk.red(chalk.bold('\tError extracting value from json:'), err.message));
                return '';
            }
        }else{
            return importCache[fullImportPath];
        }
    });
    
    //remove block comments
    var blockComments = after.match(re.blockComment) || [];
    console.log(chalk.blueBright(chalk.bold('\tBlock Comments:'), blockComments.length));
    var after = after.replace(re.blockComment, '');

    //remove trailing commas
    var trailingCommas = after.match(re.trailingComma) || [];
    console.log(chalk.blueBright(chalk.bold('\tTrailing Commas:'), trailingCommas.length));
    var after = after.replace(re.trailingComma, '$2$3');

    //fix fancy strings
    var fancyStrings = after.match(re.fancyStrings) || [];
    console.log(chalk.blueBright(chalk.bold('\tFancyStrings:'), fancyStrings.length));
    after = after.replace(re.fancyStrings, (match) => {
        match = match.replace(/\`/ig, '');
        match = JSON.stringify(match);

        return match;
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
        var debug = '';
        var totalChars = 0;
        lines.forEach((line, number) => {
            var lineNoString = parseInt(number + 1) + ': ';
            if(position){
                var lineLength = line.length;
                if(position >= totalChars && position < totalChars + line.length){
                    var linePosition = position - totalChars;
                    var offset = lineNoString.length;
                    var spaces = Array(linePosition + offset).join(' ');
                    debug += spaces + '^ ' + err.message + '\n';
                }
            }
            debug += lineNoString + line + '\n';
            totalChars += line.length;
        });
        console.error(chalk.bgRed.black.bold('There was a problem with the final JSON'));
        console.error(chalk.red.bold(err));
        console.error(chalk.gray(debug));
        console.error(chalk.red.bold(err));

        fs.writeFileSync(newPath + '.broken', after);
    }
}

