"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Module imports
var handlebars = require("handlebars");
var helpers = require("handlebars-helpers");
var sass = require("node-sass");
var scvo_router_1 = require("scvo-router");
helpers({ handlebars: handlebars });
var Context = (function () {
    function Context(context) {
        this.name = '';
        this.linkTags = [];
        this.metaTags = [];
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
                    routeHtml: routeMatch.rendered,
                    linkTags: _this.linkTags,
                    metaTags: _this.metaTags,
                    scriptTags: _this.scriptTags,
                    menus: _this.menus,
                    css: _this.compiledCss
                };
                var contextHtml = _this.compiledTemplate(templateData);
                resolve(contextHtml);
            }).catch(function (err) {
            });
        });
    };
    return Context;
}());
exports.Context = Context;
//# sourceMappingURL=context.js.map