document.addEventListener('DOMContentLoaded', function() {
    // Material Design Components
    mdc.autoInit();

    // Browser Update
    var $buoop = {notify:{i:-5,f:-4,o:-4,s:-2,c:-4},insecure:true,api:5};
    function $buo_f(){
        var e = document.createElement("script");
        e.src = "/assets/js/browser-update.min.js";
        document.body.appendChild(e);
    };
    try {document.addEventListener("DOMContentLoaded", $buo_f,false)}
    catch(e){window.attachEvent("onload", $buo_f)}

    // document.onreadystatechange = function(e) {
    //     if (document.readyState === 'complete') {
    //         document.getElementById("spinner").style.display = "none";
    //     }
    // };
    // window.onload = function () {
    //     document.getElementById("spinner").style.display = "none";
    // }

    // Mobile menu
    window.drawerEl = document.querySelector('.mdc-temporary-drawer');
    window.drawer = mdc.drawer.MDCTemporaryDrawer.attachTo(drawerEl);
    document.querySelector('#menu_button').addEventListener('click', function() {
        window.drawer.open = true;
    });
    drawerEl.addEventListener('MDCTemporaryDrawer:open', function() {
        console.log('Received MDCTemporaryDrawer:open');
    });
    drawerEl.addEventListener('MDCTemporaryDrawer:close', function() {
        console.log('Received MDCTemporaryDrawer:close');
    });

    // Headroom
    var header = document.querySelector("header.mdc-toolbar");
    var headroom  = new Headroom(header, {
        "offset": 150,
        "tolerance": 5
    });
    headroom.init();

    // Share widget
    window.share = function(where) {
        var ogTitleEl = document.head.querySelector('meta[property="og:title"]');
        var ogDescriptionEl = document.head.querySelector('meta[property="og:description"]');
        var pageTitle = ogTitleEl ? ogTitleEl.content : document.title;
        var pageDescription = ogDescriptionEl ? ogDescriptionEl.content : '';
        var pageUrl = window.location.href;
        var shareUrl, shareHeight, shareWidth;
        switch (where) {
            case ('facebook'):
                shareHeight = 420;
                shareWidth = 550;
                shareUrl = 'https://www.facebook.com/sharer.php?u=' + encodeURIComponent(pageUrl);
                break;
            case ('twitter'):
                shareHeight = 420;
                shareWidth = 550;
                shareUrl = 'https://twitter.com/intent/tweet?text=' + encodeURIComponent(pageTitle) + '&via=scvotweet&url=' + encodeURIComponent(pageUrl);
                break;
            default: return;
        }
        var shareWindow = window.open(shareUrl, 'share-window', 'height=' + shareHeight + ',width=' + shareWidth + ',location=0,menubar=0,status=0,resizable=0,toolbar=0');
    }

    // Auto-search
    window.setupAutoSearchForms = function() {
        var autoSearchForms = document.querySelectorAll('form[data-auto-search="true"]');
        for (var x = 0; x < autoSearchForms.length; x++) {
            var searchForm = autoSearchForms[x];
            var submitButton = document.createElement('button');
            submitButton.setAttribute('type', 'submit');
            submitButton.setAttribute('style', 'display:none');
            searchForm.appendChild(submitButton);
            var changeTriggers = searchForm.querySelectorAll('select,input[type="checkbox"],input[type="radio"]');
            for (var y = 0; y < changeTriggers.length; y++) {
                changeTriggers[y].addEventListener('change', function() {
                    submitButton.click();
                });
            }
        }
    }
    window.setupAutoSearchForms();

    // Resize iframes
    window.addEventListener("message", (event) => {
        if (event.data.hasOwnProperty('event')) {
            console.log('Post Message Event', event.data);
            switch (event.data.event) {
                case ('resize'):
                    document.querySelector('iframe[src*="' + event.origin + '"]').style.height = (30+event.data.height) + 'px';
                    break;
                case ('redirect'):
                    var url = event.data.url;
                    ngRouter.navigateByUrl(url);
                    break;
            }
        }
    }, false);
});
