"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var querystring = require("querystring");
var s = require("string");
var moment = require("moment");
var dot = require("dot-object");
var Helpers = /** @class */ (function () {
    function Helpers() {
    }
    Helpers.register = function (hbs) {
        var _this = this;
        Object.getOwnPropertyNames(this).forEach(function (prop) {
            if (prop.indexOf('helper_') === 0 && typeof _this[prop] === 'function') {
                var name = prop.replace(/helper_/, '');
                hbs.registerHelper(name, _this[prop]);
            }
        });
    };
    Helpers.helper_split = function (str, delimiter) {
        var parts = !str ? [] : str.split(delimiter);
        return parts;
    };
    Helpers.helper_firstItem = function (arr) {
        if (!arr)
            return null;
        if (!Array.isArray(arr))
            return null;
        if (arr.length === 0)
            return null;
        return arr[0];
    };
    Helpers.helper_lastItem = function (arr) {
        if (!arr)
            return null;
        if (!Array.isArray(arr))
            return null;
        if (arr.length === 0)
            return null;
        return arr[arr.length - 1];
    };
    Helpers.helper_slugify = function (str) {
        var slug = s(str).slugify().s;
        return slug;
    };
    Helpers.helper_querystringify = function (obj) {
        if (obj === void 0) { obj = {}; }
        var args = arguments[1];
        if (args && args.hash) {
            Object.assign(obj, args.hash);
        }
        var qs = querystring.stringify(obj);
        return qs;
    };
    Helpers.helper_ngStringify = function (obj) {
        var json = JSON.stringify(obj, null, 4);
        json = json.replace(/\{/g, "{{ '{' }}");
        return json;
    };
    Helpers.helper_jsStringify = function (obj) {
        var json = JSON.stringify(obj, null, 4);
        json = json.replace(/(<\/script)/gi, '</scr" + "ipt');
        return json;
    };
    Helpers.helper_indexOf = function (haystack, needle) {
        if (!Array.isArray(haystack)) {
            return null;
        }
        return haystack.indexOf(needle);
    };
    Helpers.helper_itemAt = function (haystack, index) {
        if (!Array.isArray(haystack) || typeof index !== 'number') {
            return null;
        }
        if (index >= haystack.length) {
            return null;
        }
        return haystack[index];
    };
    Helpers.helper_corresponding = function (source, target, item) {
        if (!Array.isArray(source) || !Array.isArray(source) || !item) {
            return null;
        }
        var srcIndex = source.indexOf(item);
        if (srcIndex === -1 || srcIndex >= target.length) {
            return null;
        }
        return target[srcIndex];
    };
    Helpers.helper_contains = function (input, val) {
        var found = false;
        if (typeof input == 'string') {
            if (typeof val == 'string') {
                found = input.indexOf(val.toString()) > -1;
            }
        }
        else if (Array.isArray(input)) {
            found = input.indexOf(val) > -1;
        }
        return found;
    };
    Helpers.helper_parse = function (str) {
        var obj = JSON.parse(str);
        return obj;
    };
    Helpers.helper_keyValue = function (obj) {
        var props = [];
        Object.keys(obj).forEach(function (key) {
            props.push({ key: key, value: obj[key] });
        });
        return props;
    };
    Helpers.helper_moment = function (date, format) {
        if (date === void 0) { date = null; }
        if (format === void 0) { format = null; }
        if (!date) {
            return moment();
        }
        else if (!format) {
            return moment(date);
        }
        else {
            return moment(date, format);
        }
    };
    Helpers.helper_momentFormat = function (date, format) {
        if (format === void 0) { format = null; }
        if (!format) {
            return date.format();
        }
        else {
            return date.format(format);
        }
    };
    Helpers.helper_atob = function (b64) {
        var buff = Buffer.from(b64, 'base64');
        var str = buff.toString('ascii');
        return str;
    };
    Helpers.helper_btoa = function (str) {
        var buff = Buffer.from(str);
        var b64 = buff.toString('base64');
        return b64;
    };
    Helpers.helper_removeEntities = function (str) {
        var out = s(str).decodeHTMLEntities().s;
        return out;
    };
    Helpers.helper_getProperty = function (obj, path) {
        if (!obj || !path) {
            return null;
        }
        var val = dot.pick(path, obj);
        return val;
    };
    Helpers.helper_getType = function (obj) {
        if (Array.isArray(obj)) {
            return 'array';
        }
        return typeof obj;
    };
    Helpers.helper_regexReplace = function (input, expression, options, replace) {
        if (typeof input !== 'string') {
            return input;
        }
        var regex = new RegExp(expression, options);
        var output = input.replace(regex, replace);
        return output;
    };
    Helpers.helper_regexMatch = function (input, expression, options) {
        if (typeof input !== 'string') {
            return input;
        }
        var regex = new RegExp(expression, options);
        var output = regex.test(input);
        return output;
    };
    Helpers.helper_reverse = function (input) {
        if (!Array.isArray(input)) {
            return [];
        }
        var reversed = [];
        while (input.length > 0) {
            reversed.push(input.pop());
        }
        return reversed;
    };
    Helpers.helper_stripTrailingSlash = function (input) {
        if (typeof input === 'string' && input.endsWith('/')) {
            return input.substr(0, input.length - 1);
        }
        else {
            return input;
        }
    };
    Helpers.helper_stripDomains = function (input, domains) {
        if (typeof input !== 'string' || !Array.isArray(domains)) {
            return input;
        }
        domains = domains.filter(function (domain) { return typeof domain === 'string'; });
        domains = domains.map(function (domain) { return domain.replace(/\./g, '\\.'); });
        var domainRegex = '((https?)?:\\/\\/)((' + domains.join(')|(') + '))';
        var domainStripper = new RegExp(domainRegex, 'ig');
        var output = input.replace(domainStripper, '');
        return output;
    };
    return Helpers;
}());
exports.Helpers = Helpers;
//# sourceMappingURL=helpers.js.map