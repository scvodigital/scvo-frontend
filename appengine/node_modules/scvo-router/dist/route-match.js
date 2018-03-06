"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Module imports
var elasticsearch_1 = require("elasticsearch");
var handlebars = require("handlebars");
var hbs = require('nymag-handlebars')();
var map_jsonify_1 = require("./map-jsonify");
var helpers_1 = require("./helpers");
/** Class that handles matched routes and gets results */
var RouteMatch = /** @class */ (function () {
    /**
     * Create a matched route to get results using parameters
     * @param {Route} route - The route that has been matched
     * @param {any} params - The parameters that the route recognizer has found
     */
    function RouteMatch(route, params, context) {
        var _this = this;
        this.params = params;
        this.context = context;
        this.name = '_default';
        this.metaData = {};
        this.pattern = null;
        this.queryDelimiter = '&';
        this.queryEquals = '=';
        this.supplimentarySearchTemplates = {};
        this.primaryResponse = null;
        this.supplimentaryResponses = {};
        this.elasticsearchConfig = null;
        this.defaultParams = {};
        this.layouts = null;
        this.layoutName = 'default';
        this.response = {
            contentBody: '',
            contentType: 'text/html',
            statusCode: 200
        };
        // Used to remember which order our supplimentary queries were executed in
        this.orderMap = [];
        this._primaryQuery = null;
        this._supplimentaryQueries = null;
        this._esClient = null;
        this._domainStripper = null;
        // Implement route
        Object.assign(this, route);
        helpers_1.Helpers.register(handlebars);
        Object.keys(context.templatePartials).forEach(function (name) {
            handlebars.registerPartial(name, context.templatePartials[name]);
        });
        Object.keys(this.context.menus).forEach(function (name) {
            _this.context.menus[name] = _this.traverseMenu(_this.context.menus[name]);
        });
        Object.keys(this.layouts).forEach(function (name) {
            if (name === 'default' || _this.layoutName !== 'default')
                return;
            if (_this.context.layouts.hasOwnProperty(name)) {
                var pattern = _this.context.layouts[name].pattern;
                var regex = new RegExp(pattern, 'ig');
                if (regex.test(_this.params.uri.href)) {
                    _this.layoutName = name;
                    _this.response.contentType = _this.context.layouts[name].contentType;
                }
                else {
                }
            }
        });
    }
    Object.defineProperty(RouteMatch.prototype, "defaultParamsCopy", {
        get: function () {
            var copy = {};
            Object.assign(copy, this.defaultParams);
            return copy;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(RouteMatch.prototype, "primaryQuery", {
        // Build our primary query
        get: function () {
            if (!this._primaryQuery) {
                // If we haven't already got this query we need to generate it
                this._primaryQuery = this.primarySearchTemplate.getPrimary(this.params);
            }
            return this._primaryQuery;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(RouteMatch.prototype, "supplimentaryQueries", {
        // Build all supplimentary queries extending our parameters with the primary results we already have
        get: function () {
            var _this = this;
            if (!this._supplimentaryQueries) {
                // If we haven't already got these queries we need to generate them
                // Extend our parameters that will be used when generating supplimentary queries
                // by adding the primary result set
                var supplimentaryParams = this.params;
                supplimentaryParams.primaryResponse = this.primaryResponse;
                this._supplimentaryQueries = { body: [] };
                // Loop through all supplimentary queries
                Object.keys(this.supplimentarySearchTemplates).forEach(function (key, order) {
                    // Elasticsearch return msearch results in order, we need to keep
                    // track of what order our supplimentary results are expected in
                    // to assign them back to the correctly keyed result set
                    _this.orderMap[order] = key;
                    var searchTemplate = _this.supplimentarySearchTemplates[key];
                    // Get both the head and body for our msearch
                    var head = searchTemplate.getHead();
                    var body = searchTemplate.getBody(supplimentaryParams);
                    // Add them to our query array
                    _this._supplimentaryQueries.body.push(head);
                    _this._supplimentaryQueries.body.push(body);
                });
            }
            return this._supplimentaryQueries;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(RouteMatch.prototype, "esClient", {
        get: function () {
            if (!this._esClient) {
                var config = Object.assign({}, this.elasticsearchConfig);
                this._esClient = new elasticsearch_1.Client(config);
            }
            return this._esClient;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(RouteMatch.prototype, "paging", {
        get: function () {
            var from = this.primaryQuery.body.from || 0;
            var size = this.primaryQuery.body.size || 10;
            var sort = this.primaryQuery.body.sort || null;
            var totalResults = this.primaryResponse.hits.total || 0;
            var totalPages = Math.ceil(totalResults / size);
            var currentPage = Math.floor(from / size) + 1;
            var nextPage = currentPage < totalPages ? Math.floor(currentPage + 1) : null;
            var prevPage = currentPage > 1 ? Math.floor(currentPage - 1) : null;
            // Setup an array (range) of 10 numbers surrounding our current page
            var pageRange = Array.from(new Array(9).keys(), function (p, i) { return i + (currentPage - 4); });
            // Move range forward until none of the numbers are less than 1
            var rangeMin = pageRange[0];
            var positiveShift = rangeMin < 1 ? 1 - rangeMin : 0;
            pageRange = pageRange.map(function (p) { return p + positiveShift; });
            // Move range backwards until none of the numbers are greater than totalPages
            var rangeMax = pageRange[pageRange.length - 1];
            var negativeShift = rangeMax > totalPages ? rangeMax - totalPages : 0;
            pageRange = pageRange.map(function (p) { return p - negativeShift; });
            // Prune everything that appears outside of our 1 to totalPages range
            pageRange = pageRange.filter(function (p) { return p >= 1 && p <= totalPages; });
            var pages = [];
            pageRange.forEach(function (page) {
                var distance = Math.abs(currentPage - page);
                pages.push({
                    pageNumber: Math.floor(page),
                    distance: distance,
                });
            });
            var paging = {
                from: from,
                size: size,
                sort: sort,
                totalResults: totalResults,
                totalPages: totalPages,
                currentPage: currentPage,
                nextPage: nextPage,
                prevPage: prevPage,
                pageRange: pages
            };
            return paging;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(RouteMatch.prototype, "domainStripper", {
        get: function () {
            if (!this._domainStripper) {
                var stripDomains = this.context.domains.map(function (domain) { return domain.replace(/\./g, '\\.'); });
                var domainRegexString = '((https?)?:\\/\\/)((' + stripDomains.join(')|(') + '))';
                this._domainStripper = new RegExp(domainRegexString, 'ig');
            }
            return this._domainStripper;
        },
        enumerable: true,
        configurable: true
    });
    RouteMatch.prototype.toJSON = function () {
        var templates = map_jsonify_1.MapJsonify(this.supplimentarySearchTemplates);
        var responses = map_jsonify_1.MapJsonify(this.supplimentaryResponses);
        return {
            name: this.name,
            metaData: this.metaData,
            pattern: this.pattern,
            queryDelimiter: this.queryDelimiter,
            queryEquals: this.queryEquals,
            primarySearchTemplate: this.primarySearchTemplate.toJSON(),
            primaryQuery: this.primaryQuery,
            supplimentarySearchTemplates: templates,
            supplimentaryQueries: this.supplimentaryQueries,
            primaryResponse: this.primaryResponse,
            supplimentaryResponses: responses,
            elasticsearchConfig: this.elasticsearchConfig,
            layouts: this.layouts,
            response: this.response,
            params: this.params,
            paging: this.paging,
            defaultParams: this.defaultParams,
            context: null,
            layoutName: this.layoutName,
        };
    };
    RouteMatch.prototype.traverseMenu = function (menuItems, level) {
        var _this = this;
        if (level === void 0) { level = 0; }
        menuItems.forEach(function (menuItem) {
            var pattern = new RegExp(menuItem.route, 'i');
            menuItem.match = pattern.test(_this.params.uri.path);
            menuItem.level = level;
            if (menuItem.children) {
                menuItem.children = _this.traverseMenu(menuItem.children, level + 1);
            }
        });
        return menuItems;
    };
    /**
     * Get primary and supplimentary results for this route match
     * @return {Promise<void>} A promise to tell when results have been fetched
     */
    RouteMatch.prototype.getResults = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            //console.log('#### ROUTE NAME:', this.name, '####');
            // Perform our primary search
            _this.esClient.search(_this.primaryQuery, function (err, primaryResponse) {
                if (err)
                    return reject(err);
                // Save the results for use in our rendered template
                _this.primaryResponse = primaryResponse;
                if (Object.keys(_this.supplimentarySearchTemplates).length > 0) {
                    // If we have any supplimentary searches to do, do them
                    _this.esClient.msearch(_this.supplimentaryQueries, function (err, supplimentaryResponses) {
                        if (err)
                            return reject(err);
                        // Loop through each of our supplimentary responses
                        supplimentaryResponses.responses.map(function (supplimentaryResponse, i) {
                            // Find out the name/key of the associated supplimentary search
                            var responseName = _this.orderMap[i];
                            // Save the response to the appropriately named property of our supplimentary responses
                            _this.supplimentaryResponses[responseName] = supplimentaryResponse;
                        });
                        _this.renderResults();
                        // We're done so let the promise owner know
                        resolve();
                    });
                }
                else {
                    _this.renderResults();
                    // We don't need to get anything else so let the promise owner know
                    resolve();
                }
            });
        });
    };
    RouteMatch.prototype.renderResults = function () {
        var _this = this;
        try {
            // Compile our template
            var routeTemplateData = {
                name: this.name,
                primaryResponse: this.primaryResponse,
                supplimentaryResponses: this.supplimentaryResponses,
                params: this.params,
                metaData: this.metaData,
                paging: this.paging,
                context: this.context,
            };
            var sections = {};
            Object.keys(this.layouts[this.layoutName]).forEach(function (sectionName) {
                var template = handlebars.compile(_this.layouts[_this.layoutName][sectionName]);
                var output = template(routeTemplateData);
                var doNotStripDomains = _this.context.layouts[_this.layoutName].doNotStripDomains;
                if (!doNotStripDomains) {
                    output = output.replace(_this.domainStripper, '');
                }
                sections[sectionName] = output;
            });
            var contextData = {
                metaData: this.context.metaData,
                domains: this.context.domains,
                menus: this.context.menus,
                routes: this.context.routes,
                route: this.toJSON(),
                uaId: this.context.uaId,
                templatePartials: this.context.templatePartials,
            };
            var template = handlebars.compile(this.context.layouts[this.layoutName].template);
            var output = template(contextData);
            output = output.replace(/(<!--{section:)([a-z0-9_-]+)(}-->)/ig, function (match, m1, m2, m3) {
                if (sections.hasOwnProperty(m2)) {
                    return sections[m2];
                }
                else {
                    return match;
                }
            });
            this.response.contentBody = output;
        }
        catch (err) {
            console.error('Error rendering route:', err);
            this.response.contentBody = JSON.stringify(err);
            this.response.statusCode = 500;
            this.response.contentType = 'application/json';
        }
    };
    return RouteMatch;
}());
exports.RouteMatch = RouteMatch;
//# sourceMappingURL=route-match.js.map