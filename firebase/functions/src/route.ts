import { crc16 } from 'js-crc';
import * as request from 'request';

const typeMap = {
    ['67BA']: 'goodmoves-job',
    ['0117']: 'funding-scotland',
    ['C283']: 'blog-post',
    ['3431']: 'staff-directory',
    ['D497']: 'funded-project',
    ['3116']: 'charter',
    ['CAD9']: 'events'
};

export function getRouteParts(referer: string): IAddressParts {
    var parts: IAddressParts = {
        referer: referer,
        host: null,
        path: null,
        page: null,
        querystring: null,
        typeId: null
    }

    var noProtocol = referer.replace(/(https?\:\/\/(www.)?)/ig, '');

    var slash = noProtocol.indexOf('/');
    if(slash > -1){
        parts.host = noProtocol.substr(0, slash);
    }else{
        parts.host = noProtocol;
    }

    var colon = parts.host.indexOf(':');
    if(colon > -1){
        parts.host = parts.host.substr(0, colon);
    }

    if(slash){
        parts.path = noProtocol.substr(slash);
    }else{
        return parts;
    }

    var lastSlash = parts.path.lastIndexOf('/');
    if(lastSlash > -1){
        parts.page = parts.path.substr(lastSlash + 1);
    }

    var questionmark = parts.path.indexOf('?');
    if(questionmark > -1){
        parts.querystring = parts.path.substr(questionmark);
        parts.path = parts.path.substr(0, questionmark);
        parts.page = parts.page.split('?')[0];
    }

    if(parts.page.length > 4 && parts.page[4] === '-'){
        var id = parts.page.substr(0, 4);
        if(id.match(/[0-9abcdef]{4}/i)){
            parts.typeId = id;
        }
    }

    return parts;
}

export function getRouteContent(addressParts: IAddressParts){
    return new Promise((resolve, reject) => {
        console.log('Address parts', addressParts);
        var elasticUrl = 'https://readonly:onlyread@50896fdf5c15388f8976945e5582a856.eu-west-1.aws.found.io/web-content/';
        if(!addressParts.typeId && !addressParts.querystring){
            // Static content request
            var docUrl = elasticUrl + 'static-content/' + addressParts.path.replace(/\//gi, '_') + '/_source';
            console.log('Document Url', docUrl)
            request.get(docUrl, (err, resp, body) => {
                if(err){
                    console.error('Error fetching static content', addressParts, err);
                    reject(err);
                }else{
                    resolve(body);
                }
            });
        }else{

        }
    });
}

export interface IAddressParts {
    referer: string;
    host: string;
    path: string;
    page: string;
    querystring: string;
    typeId: string;
}