var nar = require('../node_modules/node-async-require/src/index'),
    fs = require('fs');

var configTemplate = {
    "name": "",
    "css_prefix_text": "fa-",
    "css_use_suffix": false,
    "hinting": true,
    "units_per_em": 1000,
    "ascent": 850,
    "glyphs": []
}

var iconClasses = '';

if(process.argv.length > 2){
    iconClasses = `fa-arrow-circle-left
fa-bars
fa-caret-down
fa-chevron-left
fa-chevron-right
fa-cog
fa-envelope
fa-envelopeprefix
fa-exclamation-triangle
fa-external-link
fa-facebook
fa-facebook-square`;

    var icons = iconClasses.split('\n').filter((icon) => { return icon ? true : false });
    console.log('Finding', icons.length, 'icons');
    var found = findInFontello(icons);
    console.log('Found', found.length, 'in Fontello');
    configTemplate.glyphs = found;
    var configString = JSON.stringify(configTemplate, null, 4);
    fs.writeFile('fonts/fontello-config.json', configString, (err) => {
        if(err){
            console.error('Error writing config file', err);
        }else{
            console.log('Config written', configString);
        }
    })
    }else{
        process.stdin.resume();
        process.stdin.setEncoding('utf8');
        process.stdin.on('data', (chunk) => {
            iconClasses += chunk;
        });
        process.stdin.on('end', () => {
            var icons = iconClasses.split('\n').filter((icon) => { return icon ? true : false });
            console.log('Finding', icons.length, 'icons');
            var found = findInFontello(icons);
            console.log('Found', found.length, 'in Fontello');
            configTemplate.glyphs = found;
            var configString = JSON.stringify(configTemplate, null, 4);
            fs.writeFile('fonts/fontello-config.json', configString, (err) => {
                if(err){
                    console.error('Error writing config file', err);
                }else{
                    console.log('Config written', configString);
                }
            })
        });
    }

function findInFontello(iconClasses) {
    nar.install();
    var fontello = require("./remote-contents.ajs");
    var glyphs = [];

    fontello.forEach((iconSet) => {
        var fontname = iconSet.font.fontname;
        if (fontname === 'fontawesome') {
            iconSet.glyphs.forEach((glyph) => {
                if(iconClasses.indexOf('fa-' + glyph.css) > -1){
                    glyphs.push({
                        uid: glyph.uid,
                        css: glyph.css,
                        code: glyph.code,
                        src: 'fontawesome'
                    });
                }
            });
        }
    });

    return glyphs;
}