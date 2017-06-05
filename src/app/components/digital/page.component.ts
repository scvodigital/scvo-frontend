import { Component, ViewChild, ViewContainerRef, Input } from '@angular/core';
import { NavigationEnd, ActivatedRoute, RouterModule, Router } from '@angular/router';

import { MetaService } from '@nglibs/meta';

import { Subscription } from 'rxjs/Rx';
import * as marked from 'marked';
import * as _ from 'lodash';
import { MarkdownToHtmlPipe } from 'markdown-to-html-pipe';
import { TranslatePipe } from '../../pipes/translate.pipe';

import { AppService } from '../../services/app.service';
import { SiteComponent } from '../../common/base.component';

declare var $: any;

@Component({
    selector: 'main-container.content, page-content',
    templateUrl: './page.component.html',
    providers: [TranslatePipe]
})
export class DigitalPageComponent extends SiteComponent {
    @Input('embedded') embedded: string;

    public slugFull: string = '';
    public slugId: string = '';
    public slugPage: string = '';

    public showEdit: boolean = false;

    private _content: string = '';
    public get content(): string {
        return this._content;
    }
    public set content(value: string) {
        this._content = value;
    }

    modules = [RouterModule];

    constructor(
        appService: AppService,
        private route: ActivatedRoute,
        private router: Router,
        private translatePipe: TranslatePipe,
        private readonly meta: MetaService
    ) {
        super(appService)
    }

    private _renderer: MarkedRenderer = null;
    public get renderer(): MarkedRenderer{
        if(this._renderer === null){
            this._renderer = new marked.Renderer();
            this._renderer.link = (href: string, title: string, text: string): string => {
                var tag = '';
                if (href.indexOf('/') === 0) {
                    tag = _.template('<a [routerLink]="[\'<%= href %>\']" title="<%= title %>"><%= text %></a>')({
                        href: href,
                        title: title,
                        text: text
                    });
                } else {
                    tag = _.template('<a href="<%= href %>" title="<%= title %>"><%= text %></a>')({
                        href: href,
                        title: title,
                        text: text
                    });
                }
                return tag;
            }
        }
        return this._renderer;
    }

    onSiteLoaded() {
        if (this.embedded) {
            this.displayContent(this.embedded);
        } else {
            this.route.url.subscribe(url => {
                // Set title
                //.replace(/\//g, '_')
                this.slugFull = this.router.url.substr(1);
                this.slugId = this.router.url.replace(/\//g, '_');
                this.slugPage = this.slugFull.substr(this.slugFull.lastIndexOf('/') + 1);
                this.meta.setTitle(this.translatePipe.transform('title:-'+this.slugPage, 'en'));
                // this.meta.setTag('og:image', this.item.imageUrl);

                // Show content
                this.displayContent(this.slugFull);

                if (this.appService.user && this.appService.user.roles && this.appService.user.roles.indexOf('Administrator') > -1) {
                    this.showEdit = true;
                }
            });
        }
    }

    displayContent(page: string){
        var md = this.appService.getPage(page);
        var m2h = new MarkdownToHtmlPipe();
        var html = m2h.transform(md, { renderer: this.renderer });
        this.content = html;

        // var title = this.appService.getPhrase('title:-' + page);
        // this.appService.ms.setMeta({ title: 'Goodmoves - ' + title })
    }
}

interface IContentAndScripts {
    content: string;
    original: string;
    specialTags: string[];
}
