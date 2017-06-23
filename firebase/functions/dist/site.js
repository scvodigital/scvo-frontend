"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var util = require("util");
var handlebars = require("handlebars");
var helpers = require("handlebars-helpers");
var sass = require("node-sass");
var fs = require("fs");
var storage = require("@google-cloud/storage");
var stream = require("stream");
var gcs = storage();
var bucket = gcs.bucket('scvo-frontend.appspot.com');
helpers({ handlebars: handlebars });
function compileSite(name, siteConfig) {
    console.log(name, util.inspect(siteConfig, false, null));
    return new Promise(function (resolve, reject) {
        getHtml(siteConfig.template, siteConfig.metaData).then(function (html) {
            getCss(siteConfig.sass).then(function (css) {
                getLoaderJs(siteConfig, html, css).then(function (loaderJs) {
                    uploadFile(name + '/loader.js', 'application/javacript', loaderJs, true).then(function () {
                        var json = JSON.stringify(siteConfig, null, 4);
                        uploadFile(name + '/config.json', 'application/json', json, false).then(function () {
                            var siteConfigJs = 'window.scvoConfig = ' + json + ';';
                            uploadFile(name + '/site.js', 'application/javascript', siteConfigJs, true).then(function () {
                                resolve(loaderJs);
                            }).catch(function (err) {
                                console.error('Failed to upload siteConfigJs', err);
                                reject(err);
                            });
                        }).catch(function (err) {
                            console.error('Failed to upload siteConfig', err);
                            reject(err);
                        });
                    }).catch(function (err) {
                        console.error('Failed to upload loaderJs', err);
                        reject(err);
                    });
                }).catch(function (err) {
                    console.error('Failed to get Payload', err);
                    reject(err);
                });
            }).catch(function (err) {
                console.error('Failed to get CSS', err);
                reject(err);
            });
        }).catch(function (err) {
            console.error('Failed to get HTML', err);
            reject(err);
        });
    });
}
exports.compileSite = compileSite;
function getHtml(hbs, metaData) {
    console.log('getHtml', hbs, metaData);
    return new Promise(function (resolve, reject) {
        try {
            var template = handlebars.compile(hbs);
            console.log('Compiled template');
            var html = template(metaData);
            console.log('Rendered', html);
            resolve(html);
        }
        catch (err) {
            reject(err);
        }
    });
}
function getCss(scss) {
    console.log('getCss', scss);
    return new Promise(function (resolve, reject) {
        sass.render({ data: scss }, function (err, result) {
            console.log('sass.render', err, result);
            if (err) {
                reject(err);
            }
            else {
                resolve(result.css.toString());
            }
        });
    });
}
function uploadFile(path, contentType, contents, makePublic) {
    console.log('uploadFile', path, contentType, contents);
    return new Promise(function (resolve, reject) {
        try {
            var file = bucket.file(path);
            var options = {
                contentDisposition: 'inline',
                cacheControl: 'no-cache',
                metadata: {
                    contentType: contentType,
                    metadata: {
                        custom: 'metadata'
                    }
                },
                public: makePublic,
                validation: "md5"
            };
            var bufferStream = new stream.PassThrough();
            bufferStream.end(new Buffer(contents));
            bufferStream.pipe(file.createWriteStream(options))
                .on('error', function (err) {
                console.error('Failed to upload file', path, err);
                reject(err);
                reject(err);
            })
                .on('finish', function () {
                resolve();
            });
        }
        catch (err) {
            reject(err);
        }
    });
}
function getFile(path) {
    return new Promise(function (resolve, reject) {
        var file = bucket.file(path);
        file.exists().then(function (data) {
            if (!data || !data[0]) {
                reject('Configuration file does not exist');
            }
            else {
                file.download().then(function (buffer) {
                    try {
                        var contents = buffer.toString();
                        resolve(contents);
                    }
                    catch (err) {
                        reject(err);
                    }
                }).catch(function (err) {
                    reject(err);
                });
            }
        }).catch(function (err) {
            reject(err);
        });
    });
}
function getLoaderJs(siteConfig, html, css) {
    console.log('getLoaderJs');
    return new Promise(function (resolve, reject) {
        var compiledSite = {
            html: html,
            css: css,
            updated: new Date(),
        };
        Object.assign(compiledSite, siteConfig);
        fs.readFile('./dist/templates/page-payload.js', function (err, data) {
            if (err) {
                reject(err);
            }
            else {
                try {
                    var json = JSON.stringify(compiledSite, null, 4);
                    console.log('siteConfig JSON', json);
                    var loaderJs = data.toString().replace(/(\/\*\spayload\s\*\/)/, json);
                    console.log('Generated loaderJs', loaderJs);
                    resolve(loaderJs);
                }
                catch (err) {
                    reject(err);
                }
            }
        });
    });
}
//# sourceMappingURL=/home/tonicblue/code/scvo-frontend/firebase/functions/src/site.js.map