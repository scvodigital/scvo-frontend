import { Component, ViewChild, ViewContainerRef, Input } from '@angular/core';
import { NavigationEnd, ActivatedRoute, RouterModule, Router } from '@angular/router';

import { Subscription } from 'rxjs/Rx';
import * as marked from 'marked';
import * as _ from 'lodash';
import { MarkdownToHtmlPipe } from 'markdown-to-html-pipe';

import { AppService } from '../../services/app.service';
import { SiteComponent } from '../../common/base.component';

declare var $: any;

@Component({
    selector: 'main-container.content, page-content',
    templateUrl: './page.component.html'
})
export class PageComponent extends SiteComponent {
    @Input('embedded') embedded: string;

    private _content: string = '';
    public get content(): string {
        return this._content;
    }
    public set content(value: string) {
        this._content = value;
    }

    modules = [RouterModule];

    constructor(appService: AppService, private route: ActivatedRoute, private router: Router) { super(appService) }

    private _renderer: MarkedRenderer = null;
    public get renderer(): MarkedRenderer{
        if(this._renderer === null){
            this._renderer = new marked.Renderer();
            this._renderer.link = (href: string, title: string, text: string): string => {
                var tag = '';
                // console.log(href, text, title);
                if(href.indexOf('/') === 0){
                    tag = _.template('<a [routerLink]="[\'<%= href %>\']" title="<%= title %>"><%= text %></a>')({
                        href: href,
                        title: title,
                        text: text
                    });
                }else{
                    tag = _.template('<a href="<%= href %>" title="<%= title %>"><%= text %></a>')({
                        href: href,
                        title: title,
                        text: text
                    });
                }
                // console.log(tag);
                return tag;
            }
        }
        return this._renderer;
    }

    onSiteLoaded() {
        if(this.embedded){
            this.displayContent(this.embedded);
        }else{
            this.route.url.subscribe(url => {
                // this.displayContent(url[0].path);
                this.displayContent(this.router.url.substr(1));
            });
        }

        // $("a[href^='http://']").attr("target","_blank");
        // $("a[href^='https://']").attr("target","_blank");
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
