import * as util from 'util';
import * as handlebars from 'handlebars';
import * as helpers from 'handlebars-helpers';
import * as sass from 'node-sass';
import * as fs from 'fs';
import * as storage from '@google-cloud/storage';
import * as stream from 'stream';

const gcs = storage();
const bucket = gcs.bucket('scvo-frontend.appspot.com');
helpers({ handlebars: handlebars });

export function compileSite(name: string, siteConfig: ISiteConfig): Promise<string> {
    console.log(name, util.inspect(siteConfig, false, null));
    return new Promise<string>((resolve, reject) => {
        getHtml(siteConfig.template, siteConfig.metaData).then((html: string) => {
            getCss(siteConfig.sass).then((css: string) => {
                getLoaderJs(siteConfig, html, css).then((loaderJs: string) => {
                    uploadFile(name + '/loader.js', 'application/javacript', loaderJs, true).then(() => {
                        var json = JSON.stringify(siteConfig, null, 4);
                        uploadFile(name + '/config.json', 'application/json', json, false).then(() => {
                            var siteConfigJs = 'window.scvoConfig = ' + json + ';';
                            uploadFile(name + '/site.js', 'application/javascript', siteConfigJs, true).then(() => {
                                resolve(loaderJs);
                            }).catch((err) => {
                                console.error('Failed to upload siteConfigJs', err);
                                reject(err);
                            });
                        }).catch((err) => {
                            console.error('Failed to upload siteConfig', err);
                            reject(err);
                        });
                    }).catch((err) => {
                        console.error('Failed to upload loaderJs', err);
                        reject(err);
                    });
                }).catch((err) => {
                    console.error('Failed to get Payload', err);
                    reject(err);
                });
            }).catch((err) => {
                console.error('Failed to get CSS', err);
                reject(err);
            });
        }).catch((err) => {
            console.error('Failed to get HTML', err);
            reject(err);
        });
    });
}

function getHtml(hbs: string, metaData: any): Promise<string> {
    console.log('getHtml', hbs, metaData);
    return new Promise<string>((resolve, reject) => {
        try {
            var template = handlebars.compile(hbs);
            console.log('Compiled template');
            var html = template(metaData);
            console.log('Rendered', html);
            resolve(html);
        } catch (err) {
            reject(err);
        }
    });
}

function getCss(scss: string): Promise<string> {
    console.log('getCss', scss);
    return new Promise<string>((resolve, reject) => {
        sass.render({ data: scss }, (err, result) => {
            console.log('sass.render', err, result);
            if (err) {
                reject(err);
            } else {
                resolve(result.css.toString());
            }
        });
    });
}

function uploadFile(path: string, contentType: string, contents: string, makePublic: boolean): Promise<void> {
    console.log('uploadFile', path, contentType, contents);
    return new Promise<void>((resolve, reject) => {
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
                    console.error('Failed to upload file', path, err); reject(err);
                    reject(err);
                })
                .on('finish', function () {
                    resolve();
                });
        } catch (err) {
            reject(err);
        }
    });
}

function getFile(path: string): Promise<string> {
    return new Promise<string>((resolve, reject) => {
        var file = bucket.file(path);
        file.exists().then((data) => {
            if (!data || !data[0]) {
                reject('Configuration file does not exist');
            } else {
                file.download().then((buffer: Buffer) => {
                    try {
                        var contents = buffer.toString();
                        resolve(contents);
                    } catch (err) {
                        reject(err);
                    }
                }).catch((err) => {
                    reject(err);
                });
            }
        }).catch((err) => {
            reject(err);
        });
    });
}

function getLoaderJs(siteConfig: ISiteConfig, html: string, css: string): Promise<string> {
    console.log('getLoaderJs');
    return new Promise<string>((resolve, reject) => {
        var compiledSite = {
            html: html,
            css: css,
            updated: new Date(),
        };
        Object.assign(compiledSite, siteConfig);

        fs.readFile('./dist/templates/page-payload.js', (err: NodeJS.ErrnoException, data: Buffer) => {
            if (err) {
                reject(err);
            } else {
                try {
                    var json = JSON.stringify(compiledSite, null, 4);
                    console.log('siteConfig JSON', json);
                    var loaderJs = data.toString().replace(/(\/\*\spayload\s\*\/)/, json);
                    console.log('Generated loaderJs', loaderJs);
                    resolve(loaderJs);
                } catch (err) {
                    reject(err);
                }
            }
        });
    });
}

export interface ISiteConfig {
    template: string;
    sass: string;
    title: string;
    metaTags: IMetaTag[];
    linkTags: ILinkTag[];
    menus: IMenus;
    metaData: any;
}

export interface ISiteConfigCompiled extends ISiteConfig {
    css: string;
    html: string;
    updated: Date;
}

export interface IMenus {
    [menu: string]: IMenuItem[];
}

export interface IMenuItem {
    label: string;
    path: string;
    subMenu: IMenuItem[];
}

export interface IMetaTag {
    name: string;
    content: string;
}

export interface ILinkTag {
    rel: string;
    type: string;
    href: string;
    [attribute: string]: string;
}