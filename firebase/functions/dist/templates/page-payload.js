var scvoLoader = function (siteConfig) {
    function loadRoute(path) {

    }

    function refreshMenus() {

    }

    this.renderPage = function (page) {
        siteConfig.page = page || siteConfig.page;
        if (siteConfig.page.jsonLd) {
            createTag('script', document.head, { type: 'application/ld+json' }, { html: siteConfig.page.jsonLd }, '[type="application/ld+json"]');
        }
        addHeadTags(siteConfig.page.metaTags, siteConfig.page.linkTags);
        contentTag.innerHTML = siteConfig.page.html;
    }

    function addHeadTags(metaTags, linkTags) {
        metaTags.forEach(function (metaTag) {
            createTag('meta', document.head, metaTag, null, '[name="' + metaTag.name + '"]');
        });

        linkTags.forEach(function (linkTag) {
            createTag('link', document.head, linkTag, null, (linkTag ? '[name="' + linkTag.name + '"]' : null));
        });
    }

    function createTag(tagName, parent, atts, inner, replaceQuery) {
        // Set defaults
        atts = atts || {};
        inner = inner || {};
        replaceQuery = tagName + ' ' + (replaceQuery || 'dinnay-exist');

        // Find or create tag
        var tag = parent.querySelector(replaceQuery) || document.createElement(tagName);

        // Clear all old attributes
        while (tag.attributes.length > 0) {
            tag.removeAttribute(tag.attributes[0].name);
        }

        // Add new attributes
        Object.keys(atts).forEach(function (attribute) {
            tag.setAttribute(attribute, atts[attribute]);
        });

        if (inner.html) { // If we have some HTML to insert, insert it
            tag.innerHTML = inner.html;
        } else if (inner.text) { // If we have some Text to insert, insert it
            tag.innerText = inner.text;
        }

        // If tag isn't on page append it
        if (!tag.parent) {
            parent.appendChild(tag);
        }

        return tag;
    }

    window.addEventListener('DOMContentLoaded', function () {
        addHeadTags(siteConfig.metaTags, siteConfig.linkTags);

        var mainStyleTag = createTag('style', document.head, { type: 'text/css' }, { html: siteConfig.css });
        var mainBodyTag = createTag('div', document.body, { id: 'site' }, { html: siteConfig.html });
        var contentTag = mainBodyTag.querySelector('#page-content');
    });
}
scvoLoader(/* payload */);