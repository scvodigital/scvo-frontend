import arrDiff = require('arr-diff');
import deepDiff = require('deep-diff');
import stripHtml = require('string-strip-html');
import markdown = require('markdown');
import sqlstring = require('sqlstring');
import stringify = require('json-stringify-safe');
import * as dot from 'dot-object';
import * as moment from 'moment';
import * as querystring from 'querystring';
import * as s from 'string';
import * as Url from 'url';
import * as util from 'util';
import * as dateMath from '@elastic/datemath';

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

  static helper_getKeys(input: any) {
    if (!input) {
      return null;
    }
    return Object.keys(input);
  }

  static helper_markdown(input: string) {
    if (!input) {
      return '';
    }

    var html = markdown.markdown.toHTML(input);
    return html;
  }

  static helper_mysqlEscape(input: string, stripQuotes: boolean = false) {
    if (typeof input !== 'string') {
      return '';
    }
    var escaped = sqlstring.escape(input);
    if (typeof stripQuotes === 'boolean' && stripQuotes === true) {
      if (escaped.charAt(0) === '\'') {
        escaped = escaped.substr(1);
      }
      if (escaped.charAt(escaped.length - 1) === '\'') {
        escaped = escaped.substr(0, escaped.length - 1);
      }
    }
    return escaped;
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
    const slug = s(str.replace(/\//g, '-')).slugify().s;
    return slug;
  }

  static helper_fixUrl(url: string, protocol: string = 'http') {
    if (!url) {
      return '';
    }
    if (url.indexOf('http') === 0) {
      return url;
    }
    if (url.indexOf('//') === 0) {
      return protocol + ':' + url;
    }
    return protocol + '://' + url;
  }

  static helper_dateMath(expression: string) {
    const output: Date = dateMath.parse(expression);
    return output;
  }

  static helper_querystringify(obj: any = {}) {
    const args: IHelperArgs = arguments[1];
    const newObj: any = {};
    if (args && args.hash) {
      Object.assign(obj, args.hash);
    }
    Object.keys(obj).sort().forEach((key) => {
      if (obj[key]) {
        newObj[key] = obj[key];
        if (Array.isArray(newObj[key])) {
          newObj[key].sort();
        }
      }
    });
    const qs = querystring.stringify(newObj);
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

  static helper_blockStringify(context: any, options: any) {
    var block = options.fn(context);
    var json = JSON.stringify(block, null, 4);
    //console.log('BLOCKSTRINGIFY', json);
    return json;
  }

  static helper_safeStringify(obj: any) {
    var json = stringify(obj, null, 4);
    return json;
  }

  static helper_eachJoin(input: any[], separator: string, options: any) {
    var items: string[] = [];

    for (var i = 0; i < input.length; i++) {
      items.push(options.fn(input[i]));
    }

    items = items.filter((item: string) => {
      return !!item.replace(/\s|\r|\n/gi, '');
    });

    var out = items.join(', ');
    return out;
  }

  static helper_eachMap(input: any, options: any) {
    if (!input) return null;
    var output = [];
    var entries = (Object as any).entries(input);
    var count = entries.length;
    var current = 0;
    for (const [key, value] of entries) {
      var context = {
        '@key': key,
        '@value': value,
        '@first': current === 0,
        '@last': current === count - 1
      };
      output.push(options.fn(context));
      current++;
    }
    return output.join('\n');
  }

  static helper_arrayConcat() {
    var output = [];
    for (var i = 0; i < arguments.length; ++i) {
      if (Array.isArray(arguments[i])) {
        output.push(...arguments[i]);
      }
    }
    return output;
  }

  static helper_indexOf(haystack: any[], needle: any): number|null {
    if (!Array.isArray(haystack)) {
      return null;
    }
    return haystack.indexOf(needle);
  }

  static helper_inflect(count: number, singular: any, plural: any, includeCount: boolean) {
    var word = (count > 1 || count === 0) ? plural : singular;
    if (includeCount === true) {
      return String(count) + ' ' + word;
    } else {
      return word;
    }
  };

  static helper_toFixed(input: number|string, precision: number = 2) {
    try {
      const parsed = Number(input);
      const output = parsed.toFixed(precision);
      return output;
    } catch(err) {
      return null;
    }
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

  static helper_contains(haystack: any[]|string, val: any) {
    if (!Array.isArray(haystack) && typeof haystack !== 'string') {
      return false;
    }

    if (typeof val === 'string' || typeof val === 'number') {
      return (haystack as string).indexOf((val as string)) > -1;
    }

    for (let i = 0; i < haystack.length; ++i) {
      const item = haystack[i];
      const diff = deepDiff.diff(item, val);

      //console.log(
      //  '\n#### TEST', i, '####\n',
      //  'LHS:', item, '\n',
      //  'RHS:', val, '\n',
      //  'DIFF:', diff
      //);

      if (!diff) {
        return true;
      }
    }

    return false;
  }

  static helper_containsAny(haystack: any[], vals: any[]) {
    if (!Array.isArray(haystack) || !vals) {
      return false;
    }

    vals = Helpers.helper_arrayify(vals);

    for (var v = 0; v < vals.length; v++) {
      if (Helpers.helper_contains(haystack, vals[v])) {
        return true;
      }
    }

    return false;
  }

  static helper_obj(options: any) {
    //console.log(options);
    return options.hash;
  }

  static helper_parse(str: string) {
    //console.log('Parsing:', str);
    const obj = JSON.parse(str);
    return obj;
  }

  static helper_querystring(str: string, sep: string = '&', eq: string = '=') {
    if (typeof str !== 'string') {
      return {};
    }
    try {
      const out = querystring.parse(str);
      return out;
    } catch (err) {
      console.error(
          'Handlebars helper "querystring" failed to parse the following string:',
          str, err);
      return {};
    }
  }

  static helper_arrMatch(src: any[], dst: any[]) {
    if (!src && !dst) {
      return true;
    }
    if (!src || !dst) {
      return false;
    }

    src = Array.isArray(src) ? src : [src];
    dst = Array.isArray(dst) ? dst : [dst];

    let srcItems: any[] = [];
    let dstItems: any[] = [];

    src.forEach((item: any) => {
      if (item && srcItems.indexOf(item) === -1) {
        srcItems.push(item);
      }
    });
    srcItems.sort();
    dst.forEach((item: any) => {
      if (item && dstItems.indexOf(item) === -1) {
        dstItems.push(item);
      }
    });
    dstItems.sort();

    const diff = arrDiff(srcItems, dstItems);

    return diff.length === 0;
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

  static helper_decodeURIComponent(str: string) {
    if (!str) return '';
    console.log('DECODE URI COMPONENT BEFORE:', str);
    const out = decodeURIComponent(str);
    console.log('DECODE URI COMPONENT AFTER:', out);
    return out;
  }

  static helper_encodeURIComponent(str: string) {
    if (!str) return '';
    const out = encodeURIComponent(str);
    return out;
  }

  static helper_decodeURI(str: string) {
    if (!str) return '';
    const out = decodeURI(str);
    return out;
  }

  static helper_encodeURI(str: string) {
    if (!str) return '';
    const out = encodeURI(str);
    return out;
  }

  static helper_getProps(arr: any[], props: string[]) {
    const out: any[] = [];

    arr.forEach((item: any) => {
      const newItem: any = {};
      props.forEach((prop) => {
        newItem[prop] = item[prop];
      });
      out.push(newItem);
    });

    return out;
  }

  static helper_getProperty(obj: any, path: string) {
    if (!obj || !path) {
      return null;
    }
    // console.log('Looking for "', path, '"');
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
    //console.log('REGEX MATCH -> input:', input, '| expression:', regex, '| options:', options, '| output:', output); 
    return output;
  }

  static helper_reverse(input: any[]) {
    if (!Array.isArray(input)) {
      return [];
    }
    const reversed = [];
    for (var i = input.length; i  >= 0; --i) {
      reversed.push(input[i]);
    }
    return reversed;
  }

  static helper_stripTags(html: string) {
    if (!html) {
      return '';
    }
    return stripHtml(html);
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
    if (typeof input !== 'string' && !Array.isArray(input)) {
      return -1;
    }
    return input.length;
  }

  static helper_any(input: any[]) {
    if (!Array.isArray(input)) {
      return false;
    }
    return input.length > 0;
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

  static helper_flatten(items: any[]) {
    if (!Array.isArray(items)) {
      return null;
    }

    var output: any[] = [];
    items.forEach(item => {
      if (Array.isArray(item)) {
        output.push(...item);
      } else {
        output.push(item);
      }
    });

    return output;
  }

  static helper_distinct(items: any[]) {
    if (!Array.isArray(items)) {
      return null;
    }
    const output: any[] = [];
    items.forEach(item => {
      if (output.indexOf(item) === -1) {
        output.push(item);
      }
    });
    return output;
  }

  static helper_filter(items: any[], property: string, comparator: string, test: any) {
    const found: any[] = [];
    items.forEach(item => {
      const value: any = property === null ? item : dot.pick(property, item);
      let match = false;
      try {
        switch (comparator) {
          case ('==='): match = value === test;
            break;
          case ('=='): match = value == test;
            break;
          case ('>='): match = value >= test;
            break;
          case ('>'): match = value > test;
            break;
          case ('<='): match = value <= test;
            break;
          case ('<'): match = value < test;
            break;
          case ('testIn'): match = value.indexOf(test) > -1;
            break;
          case ('valueIn'): match = test.indexOf(value) > -1;
            break;
        }
      } catch(err) { }
      if (match) {
        found.push(item);
      }
    });
    return found;
  }

  static helper_sort(items: any[]) {
    if (!Array.isArray(items)) {
      return items;
    }
    const out = items.sort();
    return out;
  }

  static helper_sortByIndex(items: any[], index: any[], property: string) {
    if (!Array.isArray(items) || !Array.isArray(index) || typeof property !== 'string') {
      return items;
    }

    var clone: any[] = (JSON.parse(JSON.stringify(items)) as any[]);

    clone.sort((a: any, b: any) => {
      var prop1 = dot.pick(property, a);
      var prop2 = dot.pick(property, b);

      var ind1 = index.indexOf(prop1);
      var ind2 = index.indexOf(prop2);

      ind1 = ind1 > -1 ? ind1 : Math.max(items.length, index.length) + 1;
      ind2 = ind2 > -1 ? ind2 : Math.max(items.length, index.length) + 1;

      return ind1 - ind2;
    });

    return clone;
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
