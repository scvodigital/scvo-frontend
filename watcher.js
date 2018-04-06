const path = require('path');
const { spawn } = require('child_process');
const nsfw = require('nsfw');
const livereload = require('livereload');

// Paths
var json2Dir = path.join(__dirname, 'db/json2');
var assetsSrcDir = path.join(__dirname, 'assets');
var assetsDstDir = path.join(__dirname, 'build/assets');
var dbPath = path.join(__dirname, 'db/db.json');

var lsconfig = {
    extraExts: ['hbs', 'json', 'xml'],
    originalPath: 'http://scvo.local:9000',
    delay: 5000
};
var lrserver = livereload.createServer(lsconfig, (event) => {
    console.log('LIVERELOAD ->', event);
});

lrserver.watch([dbPath, assetsDstDir]);
var dbWatcher, assetsWatcher;
nsfw(json2Dir, fileUpdateHandler, { debounceMS: 2000 }).then((watcher) => { 
    dbWatcher = watcher; 
    console.log('Starting DB Watcher');
    return watcher.start(); 
});
nsfw(assetsSrcDir, fileUpdateHandler, { debounceMS: 2000 }).then((watcher) => {
    assetsWatcher = watcher;
    console.log('Starting Assets Watcher');
    return watcher.start();
});

function fileUpdateHandler(events) {
    var actualChangedFiles = [];
    events.forEach((event) => {
        if (event.file && !event.file.match(/^(\d+)$/ig)) {
            if (actualChangedFiles.indexOf(event.file) === -1) {
                actualChangedFiles.push(event.file);
            }
        }
    });    
    if (actualChangedFiles.length > 0) {
        console.log('Files Changed:', actualChangedFiles);
        var npmBuildTask = spawn('npm', ['run', 'build'], { cwd: __dirname, env: process.env });
        npmBuildTask.stdout.on('data', (data) => {
        });
        npmBuildTask.stderr.on('data', (data) => {
            console.error(data.toString());
        });
        npmBuildTask.on('close', (code) => {
            console.log(`child process exited with code ${code}`);
        });
    }
}
