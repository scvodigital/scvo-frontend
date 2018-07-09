import * as dot from 'dot-object';
import * as moment from 'moment';
import * as querystring from 'querystring';
import * as s from 'string';
import * as Url from 'url';
import * as util from 'util';

/* tslint:disable */
export interface Handlebars { registerHelper: (...args: any[]) => void; }

export class Helpers {
  static handlebars: any;

  static register(hbs: Handlebars) {
    Helpers.handlebars = hbs;
    Object.getOwnPropertyNames(this).forEach((prop: string) => {
      if (prop.indexOf('helper_') === 0) {
        if (typeof (this as any)[prop] === 'function') {
          const name = prop.replace(/helper_/, '');
          hbs.registerHelper(name, (this as any)[prop]);
        }
      }
    });
  }

  static helper_split(str: string, delimiter: string) {
    const parts = !str ? [] : str.split(delimiter);
    return parts;
  }

  static helper_arrayify(input: any) {
    if (Array.isArray(input)) {
      return input;
    }
    return [input];
  }

  static helper_firstItem(arr: any[]) {
    if (!arr) return null;
    if (!Array.isArray(arr)) return null;
    if (arr.length === 0) return null;
    return arr[0];
  }

  static helper_lastItem(arr: any[]) {
    if (!arr) return null;
    if (!Array.isArray(arr)) return null;
    if (arr.length === 0) return null;
    return arr[arr.length - 1];
  }

  static helper_slugify(str: string) {
    const slug = s(str).slugify().s;
    return slug;
  }

  static helper_querystringify(obj: any = {}) {
    const args: IHelperArgs = arguments[1];
    if (args && args.hash) {
      Object.assign(obj, args.hash);
    }
    const qs = querystring.stringify(obj);
    return qs;
  }

  static helper_ngStringify(obj: any) {
    let json = JSON.stringify(obj, null, 4);
    json = json.replace(/\{/g, '{{ \'{\' }}');
    return json;
  }

  static helper_jsStringify(obj: any) {
    let json = JSON.stringify(obj, null, 4);
    json = json.replace(/(<\/script)/gi, '</scr" + "ipt');
    return json;
  }

  static helper_indexOf(haystack: any[], needle: any): number|null {
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

    const srcIndex = source.indexOf(item);

    if (srcIndex === -1 || srcIndex >= target.length) {
      return null;
    }

    return target[srcIndex];
  }

  static helper_contains(input: any[]|string, val: any) {
    let found = false;
    if (typeof input === 'string') {
      if (typeof val === 'string') {
        found = input.indexOf(val.toString()) > -1;
      }
    } else if (Array.isArray(input)) {
      found = input.indexOf(val) > -1;
    }
    return found;
  }

  static helper_parse(str: string) {
    const obj = JSON.parse(str);
    return obj;
  }

  static helper_querystring(str: string, sep: string = '&', eq: string = '=') {
    if (typeof str !== 'string') {
      return {};
    }
    try {
      const out = querystring.parse(str, sep, eq);
      return out;
    } catch(err) {
      console.error('Handlebars helper "querystring" failed to parse the following string:', str, err);
      return {};
    }
  }

  static helper_keyValue(obj: any) {
    const props: Array < {
      key: string;
      value: any
    }
    > = [];
    Object.keys(obj).forEach((key: string) => {
      props.push({key, value: obj[key]});
    });
    return props;
  }

  static helper_moment(date: any = null, format = '') {
    if (!date) {
      return moment();
    } else if (!format) {
      return moment(date);
    } else {
      return moment(date, format);
    }
  }

  static helper_momentFormat(date: moment.Moment, format = '') {
    if (!format) {
      return date.format();
    } else {
      return date.format(format);
    }
  }

  static helper_atob(b64: string) {
    try {
      const buff = Buffer.from(b64, 'base64');
      const str = buff.toString('ascii');
      return str;
    } catch (err) {
      return '';
    }
  }

  static helper_btoa(str: string) {
    const buff = Buffer.from(str);
    const b64 = buff.toString('base64');
    return b64;
  }

  static helper_removeEntities(str: string) {
    const out = s(str).decodeHTMLEntities().s;
    return out;
  }

  static helper_getProperty(obj: any, path: string) {
    if (!obj || !path) {
      return null;
    }
    const val = dot.pick(path, obj);
    return val;
  }

  static helper_dot(path: string, options: any) {
    if (typeof path !== 'string') {
      return null;
    }
    const val = dot.pick(path, options.data.root);
    return val;
  }

  static helper_getType(obj: any) {
    if (Array.isArray(obj)) {
      return 'array';
    }
    return typeof obj;
  }

  static helper_regexReplace(
      input: string, expression: string, options: string, replace: string) {
    if (typeof input !== 'string') {
      return input;
    }
    const regex = new RegExp(expression, options);
    const output = input.replace(regex, replace);
    return output;
  }

  static helper_regexMatch(input: string, expression: string, options: string) {
    if (typeof input !== 'string') {
      return input;
    }
    const regex = new RegExp(expression, options);
    const output = regex.test(input);
    return output;
  }

  static helper_reverse(input: any[]) {
    if (!Array.isArray(input)) {
      return [];
    }
    const reversed = [];
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
    domains = domains.map((domain: string) => domain.replace(/\./g, '\\.'));
    const domainRegex = '((https?)?:\\/\\/)((' + domains.join(')|(') + '))';
    const domainStripper = new RegExp(domainRegex, 'ig');
    const output = input.replace(domainStripper, '');
    return output;
  }

  static helper_length(input: any[]|string) {
    if (typeof input !== 'string' || !Array.isArray(input)) {
      return -1;
    }
    return input.length;
  }

  static helper_pluck(items: any[], path: string) {
    if (typeof path !== 'string' || !Array.isArray(items)) {
      return null;
    }
    const output: any[] = [];
    items.forEach(item => {
      const val = dot.pick(path, item);
      output.push(val);
    });

    return output;
  }

  static helper_component(partialName: string, options: any) {
    if (typeof partialName !== 'string' ||
        !Helpers.handlebars.partials.hasOwnProperty(partialName)) {
      return null;
    }
    const partial = Helpers.handlebars.partials[partialName];
    const template = Helpers.handlebars.compile(partial);
    const html = template(options);
    return new Helpers.handlebars.SafeString(html)
  }

  static helper_log(message: string, obj: any) {
    console.log('####', message, '->', obj);
  }
}

export interface IHelperArgs {
  name: string;
  hash: any;
  data: any;
}
/* tslint:enable */
