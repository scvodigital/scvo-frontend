"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var handlebars = require("handlebars");
var helpers = require("handlebars-helpers");
var sass = require("node-sass");
var scvo_router_1 = require("scvo-router");
helpers({ handlebars: handlebars });
var Context = /** @class */ (function () {
    function Context(context) {
        this.name = '';
        this.linkTags = [];
        this.metaTags = [];
        this.metaData = {};
        this.scriptTags = [];
        this.menus = {};
        this.routes = {};
        this.sass = '';
        this.template = '';
        // Instance specific properties
        this.compiledTemplate = null;
        this.compiledCss = null;
        this.router = null;
        Object.assign(this, context);
        // Setup our router
        this.router = new scvo_router_1.Router(this.routes);
        // Compile our templates and CSS
        this.compiledTemplate = handlebars.compile(this.template);
        this.compiledCss = sass.renderSync({ data: this.sass, sourceMap: false, outputStyle: 'compact' }).css.toString('utf8');
    }
    Context.prototype.renderPage = function (uriString) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.router.execute(uriString).then(function (routeMatch) {
                var templateData = {
                    linkTags: _this.linkTags,
                    metaTags: _this.metaTags,
                    metaData: _this.metaData,
                    scriptTags: _this.scriptTags,
                    menus: _this.menus,
                    css: _this.compiledCss,
                    routes: _this.routes,
                    route: routeMatch,
                    headerTags: _this.getHeaderTags(routeMatch)
                };
                console.log('TEMPLATE DATA:', JSON.stringify(templateData, null, 4));
                var contextHtml = _this.compiledTemplate(templateData);
                var closingHeadTag = contextHtml.indexOf('</head>');
                if (closingHeadTag > -1) {
                    var dataJson = JSON.stringify(templateData, null, 4);
                    dataJson = dataJson.replace(/\<\/script/ig, '</scr" + "ipt');
                    var dataTag = "\n                        <script>\n                            window.contextData = " + dataJson + ";\n                        </script>\n                    ";
                    contextHtml = [contextHtml.slice(0, closingHeadTag), dataTag, contextHtml.slice(closingHeadTag)].join('');
                }
                resolve(contextHtml);
            }).catch(function (err) {
                console.error('Failed to render route', err);
                reject(err);
            });
        });
    };
    Context.prototype.getHeaderTags = function (routeMatch) {
        var _this = this;
        var linkTags = {};
        var metaTags = {};
        (this.linkTags || []).forEach(function (linkTag) {
            var key = linkTag.name || 'clt' + Math.floor(Math.random() * 999999);
            var tag = _this.renderTag('link', linkTag);
            linkTags[key] = tag;
        });
        (this.metaTags || []).forEach(function (metaTag) {
            var key = metaTag.name || 'cmt' + Math.floor(Math.random() * 999999);
            var tag = _this.renderTag('meta', metaTag);
            metaTags[key] = tag;
        });
        (routeMatch.linkTags || []).forEach(function (linkTag) {
            var key = linkTag.name || 'rlt' + Math.floor(Math.random() * 999999);
            var tag = _this.renderTag('link', linkTag);
            linkTags[key] = tag;
        });
        (routeMatch.metaTags || []).forEach(function (metaTag) {
            var key = metaTag.name || 'rmt' + Math.floor(Math.random() * 999999);
            var tag = _this.renderTag('meta', metaTag);
            metaTags[key] = tag;
        });
        var linkTagsHtml = Object.keys(linkTags).map(function (key) {
            return linkTags[key];
        }).join('\n');
        var metaTagsHtml = Object.keys(metaTags).map(function (key) {
            return metaTags[key];
        }).join('\n');
        //TODO: Add pagination params and link generators to route and include link tags here
        //TODO: Add some kind of title templating here as well
        var headerTags = "\n            <!-- Start of Generated Route Header Tags -->\n            " + linkTagsHtml + "\n            " + metaTagsHtml + "\n            <!-- End of Generated Route Header Tags -->\n        ";
        return headerTags;
    };
    Context.prototype.renderTag = function (tagName, attributes) {
        var keyValuePairs = [];
        Object.keys(attributes).forEach(function (key) {
            var pair = key + "=\"" + attributes[key] + "\"";
            keyValuePairs.push(pair);
        });
        var attributesString = keyValuePairs.join(' ');
        var tag = "<" + tagName + " " + attributesString + " data-route-generated=\"true\">";
        return tag;
    };
    return Context;
}());
exports.Context = Context;
//# sourceMappingURL=context.js.map