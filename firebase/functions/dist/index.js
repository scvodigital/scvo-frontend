"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var util = require("util");
var functions = require("firebase-functions");
var admin = require("firebase-admin");
var Site = require("./site");
var Route = require("./route");
var request = require("request");
var cors = require("cors");
var secrets = require('./secrets.json');
var app = admin.initializeApp({
    credential: admin.credential.cert(secrets),
    databaseURL: "https://scvo-frontend.firebaseio.com"
});
// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });
exports.compileSite = functions.database.ref('/sites/{site}/').onWrite(function (event) {
    return new Promise(function (resolve, reject) {
        var siteConfig = event.data.val();
        Site.compileSite(event.params.site, siteConfig).then(function (loaderJs) {
            resolve();
        }).catch(function (err) {
            console.error('Failed to compile site', util.inspect(err, false, null));
            reject(err);
        });
    });
});
exports.updateStaticContentIndex = functions.database.ref('/static-content/{id}/').onWrite(function (event) {
    return new Promise(function (resolve, reject) {
        var id = event.params.id;
        var url = 'http://search.scvo.net/scvo-static-content/update/' + id + '?token=' + secrets.elasticsauceToken;
        request.get(url, function (err, resp, body) {
            if (err) {
                console.error('Failed to call update', err);
                reject(err);
            }
            else {
                console.log(body);
                resolve();
            }
        });
    });
});
exports.loadSite = functions.https.onRequest(function (req, res) {
    cors(req, res, function () {
        var addressParts = Route.getRouteParts(req.get('referer'));
        getSiteKey(addressParts).then(function (siteKey) {
            var redirectUrl = '';
            if (isBot(req.get('user-agent'))) {
                redirectUrl = 'https://storage.googleapis.com/scvo-frontend.appspot.com/' + siteKey + '/loader.js';
            }
            else {
                redirectUrl = 'https://storage.googleapis.com/scvo-frontend.appspot.com/' + siteKey + '/site.js';
            }
            res.redirect(redirectUrl);
        }).catch(function (err) {
            res.json(500, err);
        });
    });
});
exports.loadRoute = functions.https.onRequest(function (req, res) {
    var addressParts = Route.getRouteParts(req.get('referer'));
    Route.getRouteContent(addressParts).then(function (body) {
        if (req.query.declare) {
            // If we see a declare querystring parameters, this is being called before Angular has loaded
            // so it is being included as a script tag and will therefore need to be set to a var
            body = 'window.scvoContent = ' + body;
            res.contentType('application/javascript');
        }
        else {
            // If this is being called from Angular we just wanna return the object in a JSON readable way
            res.contentType('applications/json');
        }
        res.send(body);
    }).catch(function (err) {
        res.json(500, err);
    });
});
function getSiteConfig(siteKey) {
    return new Promise(function (resolve, reject) {
        app.database().ref('/sites/' + siteKey).once('value').then(function (siteConfigObject) {
            if (siteConfigObject.exists()) {
                var siteConfiguration = siteConfigObject.val();
                resolve(siteConfiguration);
            }
            else {
                reject(new Error('Could not find site configuration'));
            }
        }).catch(function (err) {
            reject(err);
        });
    });
}
function getSiteKey(addressParts) {
    return new Promise(function (resolve, reject) {
        var domainKey = addressParts.host.replace(/\./gi, '-');
        app.database().ref('/config/domains/' + domainKey).once('value').then(function (domainObject) {
            if (domainObject.exists()) {
                var siteKey = domainObject.val();
                resolve(siteKey);
            }
            else {
                reject(new Error('Invalid domain name'));
            }
        }).catch(function (err) {
            reject(err);
        });
    });
}
function isBot(userAgent) {
    userAgent = userAgent.toLowerCase();
    var bots = ["googlebot", "adsbot-google", "mediapartners-google", "bingbot", "slurp", "java", "wget", "curl", "commons-httpclient", "python-urllib", "libwww", "httpunit", "nutch", "go-http-client", "phpcrawl", "msnbot", "jyxobot", "fast-webcrawler", "crawler", "biglotron", "teoma", "convera", "seekbot", "gigabot", "gigablast", "exabot", "ngbot", "ia_archiver", "gingercrawler", "webmon ", "httrack", "webcrawler", "grub.org", "usinenouvellecrawler", "antibot", "netresearchserver", "speedy", "fluffy", "bibnum.bnf", "findlink", "msrbot", "panscient", "yacybot", "aisearchbot", "ioi", "ips-agent", "tagoobot", "mj12bot", "dotbot", "woriobot", "yanga", "buzzbot", "mlbot", "yandex", "purebot", "linguee", "cyberpatrol", "voilabot", "baiduspider", "citeseerxbot", "spbot", "twengabot", "postrank", "turnitinbot", "scribdbot", "page2rss", "sitebot", "linkdex", "adidxbot", "blekkobot", "ezooms", "dotbot", "mail.ru_bot", "discobot", "heritrix", "findthatfile", "europarchive.org", "nerdbynature.bot", "sistrix crawler", "ahrefsbot", "aboundex", "domaincrawler", "wbsearchbot", "summify", "ccbot", "edisterbot", "seznambot", "ec2linkfinder", "gslfbot", "aihitbot", "intelium_bot", "facebookexternalhit", "yeti", "retrevopageanalyzer", "lb-spider", "sogou", "lssbot", "careerbot", "wotbox", "wocbot", "ichiro", "duckduckbot", "lssrocketcrawler", "drupact", "webcompanycrawler", "acoonbot", "openindexspider", "gnam gnam spider", "web-archive-net", "backlinkcrawler", "coccoc", "integromedb", "toplistbot", "seokicks-robot", "it2media-domain-crawler", "ip-web-crawler", "siteexplorer", "elisabot", "proximic", "changedetection", "blexbot", "arabot", "wesee:search", "niki-bot", "crystalsemanticsbot", "rogerbot", "360spider", "psbot", "interfaxscanbot", "lipperhey seo service", "cc metadata scaper", "g00g1e.net", "grapeshotcrawler", "urlappendbot", "brainobot", "fr-crawler", "binlar", "simplecrawler", "livelapbot", "twitterbot", "cxensebot", "smtbot", "bnf.fr_bot", "a6-indexer", "admantx", "facebot", "twitterbot", "orangebot", "memorybot", "advbot", "megaindex", "semanticscholarbot", "ltx71", "nerdybot", "xovibot", "bubing", "qwantify", "archive.org_bot", "applebot", "tweetmemebot", "crawler4j", "findxbot", "semrushbot", "yoozbot", "lipperhey", "y!j-asr", "domain re-animator bot", "addthis", "screaming frog seo spider", "metauri", "scrapy", "livelapbot", "openhosebot", "capsulechecker", "collection@infegy.com", "istellabot", "deusu", "betabot", "cliqzbot", "mojeekbot", "netestate ne crawler", "safesearch microdata crawler", "gluten free crawler", "sonic", "sysomos", "trove", "deadlinkchecker", "slack-imgproxy", "embedly", "rankactivelinkbot", "iskanie", "safednsbot", "skypeuripreview", "veoozbot", "slackbot", "redditbot", "datagnionbot", "google-adwords-instant", "adbeat_bot", "scanbot", "whatsapp", "contxbot", "pinterest", "electricmonk", "garlikcrawler", "bingpreview", "vebidoobot", "femtosearchbot"];
    for (var i = 0; i < bots.length; i++) {
        if (userAgent.indexOf(bots[i]) > -1) {
            return true;
        }
    }
    return false;
}
//# sourceMappingURL=/home/tonicblue/code/scvo-frontend/firebase/functions/src/index.js.map