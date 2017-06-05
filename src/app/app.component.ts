import { Component, Directive, ElementRef, OnInit, OnDestroy } from '@angular/core';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';

import { BreadcrumbService } from 'ng2-breadcrumb/ng2-breadcrumb';

import { TranslatePipe } from './pipes/translate.pipe';

import { AppService } from './services/app.service';

// declare var Headroom: any;
declare var $: any;
declare var window: any;
declare var lastScrollTop: number;
declare var delta: number;
declare var navbarHeight: number;

@Component({
    selector: 'scvo',
    templateUrl: './app.component.html',
    providers: [TranslatePipe]
})
export class AppComponent implements OnInit {
    public pathClasses: string = '';

    public didScroll: boolean = false;

    constructor(
        public router: Router,
        public _appService: AppService,
        private breadcrumbService: BreadcrumbService,
        private translatePipe: TranslatePipe
    ) {
        // On navigation
        this.router.events.subscribe(event => {
            if (event instanceof NavigationEnd) {
                // Go to top of page
                window.scrollTo(0,0);

                // Hide main menu dropdown if still open
                $('.dropdown-content').hide();

                // Set page classes for styling
                this.pathClasses = this.router.url.replace(/\//g, ' ').trim();
                if (this.pathClasses.indexOf(';')!=-1) this.pathClasses = this.pathClasses.substr(0, this.pathClasses.indexOf(';'));
                if (!this.pathClasses) this.pathClasses = 'home';
            }
        });

        breadcrumbService.addCallbackForRouteRegex('.*', breadcrumb => this.translatePipe.transform('title:-'+breadcrumb, 'en'));
    }

    ngOnInit() {
        // var headroom = new Headroom($("header")[0]);
        // headroom.init();
        // this.headerPadding();
        // $(window).on('resize', this.headerPadding);

        // Hide Header on on scroll down
        var lastScrollTop = 0;
        var delta = 5;
        var navbarHeight = $('header').outerHeight();

        $(window).scroll(function(event){
            this.didScroll = true;
        });

        setInterval(function() {
            if (this.didScroll) {
                hasScrolled();
                this.didScroll = false;
            }
        }, 250);

        function hasScrolled() {
            var st = $('body').scrollTop();

            // Make sure they scroll more than delta
            if(Math.abs(lastScrollTop - st) <= delta)
            return;

            // If they scrolled down and are past the navbar, add class .nav-up.
            // This is necessary so you never see what is "behind" the navbar.
            if (st > lastScrollTop && st > navbarHeight){
                // Scroll Down
                console.log('down');
                $('header').removeClass('nav-down').addClass('nav-up');
            } else {
                // Scroll Up
                console.log('up');
                if(st + $(window).height() < $(document).height()) {
                    $('header').removeClass('nav-up').addClass('nav-down');
                }
            }

            lastScrollTop = st;
        }
    }

    // public headerPadding() {
    //     if ($(window).width() < 992) {
    //         $('header').css('margin-top', 0 - $('header').outerHeight());
    //         $('body').css('padding-top', $('header').outerHeight());
    //     } else {
    //         $('header').css('margin-top', 0);
    //         $('body').css('padding-top', 0);
    //     }
    // }
}
