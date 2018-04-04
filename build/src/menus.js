"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var request = require("request");
function getMenus(domain, stripDomains) {
    return __awaiter(this, void 0, void 0, function () {
        var domainRegex, domainRegexString, menuIds, menusArray, i, menuId, menu, menus;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    domainRegex = /\./g;
                    if (stripDomains && stripDomains.length > 0) {
                        stripDomains = stripDomains.map(function (domain) {
                            return domain.replace(/\./g, '\\.');
                        });
                        domainRegexString = '((https?)?:\\/\\/)((' + stripDomains.join(')|(') + '))';
                        domainRegex = new RegExp(domainRegexString, 'ig');
                    }
                    return [4 /*yield*/, getMenuIds(domain)];
                case 1:
                    menuIds = _a.sent();
                    menusArray = [];
                    i = 0;
                    _a.label = 2;
                case 2:
                    if (!(i < menuIds.length)) return [3 /*break*/, 5];
                    menuId = menuIds[i];
                    return [4 /*yield*/, getMenu(domain, menuId)];
                case 3:
                    menu = _a.sent();
                    menusArray.push(menu);
                    _a.label = 4;
                case 4:
                    i++;
                    return [3 /*break*/, 2];
                case 5:
                    menus = {};
                    menusArray.forEach(function (menu) {
                        if (menu.slug) {
                            menus[menu.slug] = menu.items.map(function (item) {
                                return transformWpMenu(item, domainRegex);
                            });
                        }
                    });
                    return [2 /*return*/, menus];
            }
        });
    });
}
exports.getMenus = getMenus;
function getMenuIds(domain) {
    return new Promise(function (resolve, reject) {
        var options = {
            url: "https://" + domain + "/wp-json/wp-api-menus/v2/menus",
            json: true,
        };
        request.get(options, function (err, resp, body) {
            if (err) {
                return reject(err);
            }
            if (!Array.isArray(body)) {
                return reject(new Error('Expected array response but instead got: ' +
                    JSON.stringify(body, null, 4)));
            }
            var menuIds = [];
            body.forEach(function (menu) {
                if (menu.term_id) {
                    menuIds.push(menu.term_id);
                }
            });
            resolve(menuIds);
        });
    });
}
function getMenu(domain, menuId) {
    return new Promise(function (resolve, reject) {
        var options = {
            url: "https://" + domain + "/wp-json/wp-api-menus/v2/menus/" + menuId,
            json: true,
        };
        request(options, function (err, resp, body) {
            if (err) {
                return reject(err);
            }
            resolve(body);
        });
    });
}
function transformWpMenu(wpMenuItem, domainRegex) {
    var children = !wpMenuItem.children ? [] : wpMenuItem.children.map(function (child) {
        return transformWpMenu(child, domainRegex);
    });
    var metaData = {};
    if (wpMenuItem.meta_data) {
        Object.keys(wpMenuItem.meta_data).forEach(function (key) {
            var value = wpMenuItem.meta_data[key];
            if (Array.isArray(value) && value.length === 1) {
                metaData[key] = value[0];
            }
            else {
                metaData[key] = value;
            }
        });
    }
    var route = metaData['menu-item-route-pattern'] || null;
    var path = wpMenuItem.url;
    if (domainRegex) {
        var found = domainRegex.exec(path);
        console.log('DOMAIN REPLACE:', path, '| FOUND:', found);
        path = path.replace(domainRegex, '');
    }
    if (path.endsWith('/')) {
        path = path.substr(0, path.length - 1);
    }
    var menuItem = {
        label: wpMenuItem.title,
        path: path,
        route: route,
        children: children,
        metaData: metaData,
    };
    return menuItem;
}
/* tslint:enable */
//# sourceMappingURL=menus.js.map