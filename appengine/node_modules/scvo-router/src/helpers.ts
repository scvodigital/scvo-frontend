import * as Url from 'url';
import * as querystring from 'querystring';
import * as s from 'string';
import * as moment from 'moment';
import * as dot from 'dot-object';

export class Helpers {
    static register(hbs: any) {
        Object.getOwnPropertyNames(this).forEach((prop) => {
            if(prop.indexOf('helper_') === 0 && typeof this[prop] === 'function'){
                var name = prop.replace(/helper_/, '');
                hbs.registerHelper(name, this[prop]);
            }
        });
    }

    static helper_split(str: string, delimiter: string) {
        var parts = !str ? [] : str.split(delimiter);
        return parts;
    }

    static helper_firstItem(arr: any[]) {
        if(!arr) return null;
        if(!Array.isArray(arr)) return null;
        if(arr.length === 0) return null;
        return arr[0];
    }
    
    static helper_lastItem(arr: any[]) {
        if(!arr) return null;
        if(!Array.isArray(arr)) return null;
        if(arr.length === 0) return null;
        return arr[arr.length - 1];
    }

    static helper_slugify(str: string) {
        var slug = s(str).slugify().s;
        return slug;
    }

    static helper_querystringify(obj: any = {}) {
        var args: IHelperArgs = arguments[1];
        if(args && args.hash){
            Object.assign(obj, args.hash);
        }
        var qs = querystring.stringify(obj);
        return qs;
    }

    static helper_ngStringify(obj: any) {
        var json = JSON.stringify(obj, null, 4);
        json = json.replace(/\{/g, "{{ '{' }}");
        return json;
    }

    static helper_jsStringify(obj: any) {
        var json = JSON.stringify(obj, null, 4);
        json = json.replace(/(<\/script)/gi, '</scr" + "ipt');
        return json;
    }

    static helper_indexOf(haystack: any[], needle: any): number {
        if (!Array.isArray(haystack)) {
            return null;
        }
        return haystack.indexOf(needle);
    }

    static helper_itemAt(haystack: any[], index: number): any {
        if (!Array.isArray(haystack) || typeof index !== 'number') {
            return null;
        }
        if (index >= haystack.length) {
            return null;
        }
        return haystack[index];
    }

    static helper_corresponding(source: any[], target: any[], item: any): any {
        if (!Array.isArray(source) || !Array.isArray(source) || !item) {
            return null;
        }

        var srcIndex = source.indexOf(item);

        if (srcIndex === -1 || srcIndex >= target.length) {
            return null;
        }

        return target[srcIndex];
    }

    static helper_contains(input: any[]|string, val: any) {
        var found = false;
        if (typeof input == 'string') {
            if (typeof val == 'string') {
                found = input.indexOf(val.toString()) > -1;
            }
        } else if (Array.isArray(input)) {
            found = input.indexOf(val) > -1;
        }
        return found;
    }

    static helper_parse(str: string) {
        var obj = JSON.parse(str);
        return obj;
    }

    static helper_keyValue(obj: any) {
        var props = [];
        Object.keys(obj).forEach((key: string) => {
            props.push({ key: key, value: obj[key] });
        });
        return props;
    }

    static helper_moment(date: any = null, format: string = null) {
        if (!date) {
            return moment();
        } else if (!format) {
            return moment(date);
        } else {
            return moment(date, format);
        }
    }

    static helper_momentFormat(date: moment.Moment, format: string = null) {
        if (!format) {
            return date.format();
        } else {
            return date.format(format);
        }
    }

    static helper_atob(b64: string) {
        var buff = Buffer.from(b64, 'base64');
        var str = buff.toString('ascii');
        return str;
    }

    static helper_btoa(str: string) {
        var buff = Buffer.from(str);
        var b64 = buff.toString('base64');
        return b64;
    }

    static helper_removeEntities(str: string) {
        var out = s(str).decodeHTMLEntities().s;
        return out;
    }

    static helper_getProperty(obj: any, path: string) {
        if (!obj || !path) {
            return null;
        }
        var val = dot.pick(path, obj);
        return val;
    }

    static helper_getType(obj: any) {
        if (Array.isArray(obj)) {
            return 'array';
        }
        return typeof obj;
    }

    static helper_regexReplace(input: string, expression: string, options: string, replace: string) {
        if (typeof input !== 'string') {
            return input;
        }
        var regex = new RegExp(expression, options);
        var output = input.replace(regex, replace);
        return output;
    }

    static helper_regexMatch(input: string, expression: string, options: string) {
        if (typeof input !== 'string') {
            return input;
        }
        var regex = new RegExp(expression, options);
        var output = regex.test(input);
        return output;
    }

    static helper_reverse(input: any[]) {
        if (!Array.isArray(input)) {
            return [];
        }
        var reversed = [];
        while (input.length > 0) {
            reversed.push(input.pop());
        }
        return reversed;
    }

    static helper_stripTrailingSlash(input: string) {
        if (typeof input === 'string' && input.endsWith('/')) {
            return input.substr(0, input.length - 1);
        } else {
            return input;
        }
    }

    static helper_stripDomains(input: string, domains: string[]) {
        if (typeof input !== 'string' || !Array.isArray(domains)) {
            return input;
        }
        domains = domains.filter(domain => typeof domain === 'string');
        domains = domains.map((domain: string) => { return domain.replace(/\./g, '\\.'); });
        var domainRegex = '((https?)?:\\/\\/)((' + domains.join(')|(') + '))';
        var domainStripper = new RegExp(domainRegex, 'ig');
        var output = input.replace(domainStripper, '');
        return output
    }
}

export interface IHelperArgs {
    name: string;
    hash: any;
    data: any;
}
