import { Component, ElementRef } from '@angular/core';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Rx';
import { AppService } from '../../services/app.service';
import { IHit, IDocument, ISearchParameters } from '../../services/elastic.service';

@Component({
    selector: 'main-container.content',
    templateUrl: './event-list.component.html'
})
export class EventListComponent {
    public hits: IHit<IDocument>[] = [];
    public perPage: number = 100;
    public resultsTotal: number = -1;
    public pageTotal: number = 0;
    public loading: boolean = true;
    // public totalSigned: number = null;

    private _parameters: ISearchParameters = null;
    public get parameters(): ISearchParameters {
        return this._parameters;
    }
    public set parameters(value: ISearchParameters) {
        this._parameters = value;
    }

    public get query(): string {
        return this.parameters.query;
    }
    public set query(value: string) {
        this.parameters.query = value;
    }

    public get category(): string {
        return this.parameters.category;
    }
    public set category(value: string) {
        this.parameters.category = value;
        this.search();
    }

    public get sort(): string {
        return this.parameters.sort;
    }
    public set sort(value: string) {
        this.parameters.sort = value;
        this.search();
    }

    public events: IHit<IDocument>[];

    get categories(): any[] {
        return this.appService.getTerms('categories');
    };

    constructor(private appService: AppService, private router: Router, private route: ActivatedRoute) {
        this.onSiteLoaded();
    }

    search(keepPage: boolean = false) {
        this.parameters.page = this.parameters.page || 1;
        var params: ISearchParameters = { };
        if(keepPage && this.parameters.page && this.parameters.page > 1){
            params.page = this.parameters.page;
        }
        if(this.query){
            params.query = this.query;
        }
        if(this.category){
            params.category = this.category;
        }
        params.sort = this.sort || 'start';
        this.router.navigate(['./services/events', params]);
    }

    onSiteLoaded() {
        var that = this;
        this.route.params.subscribe((params: any) => {
            // this.appService.es.getDocumentCount().then((count) => {
            //     this.totalSigned = count;
            // });

            this.loading = true;
            this.parameters = {
                index: 'events',
                type: 'event',
                size: this.perPage,
                query: params.query || '',
                category: params.category || '',
                page: !params.page ? 1 : parseInt(params.page),
                sort: params.sort || 'start'
            };
            this.appService.es.constructSearch(this.parameters).then((results) => {
                // console.log(results);
                this.events = results.hits;
                this.resultsTotal = results.total;
                this.pageTotal = Math.ceil(this.resultsTotal / this.perPage);
                this.loading = false;
            }).catch(err => {
                console.error('Error searching', params, err);
                this.loading = false;
            });
        });
    }

    changePage(page: number){
        this.parameters.page = page;
        this.search(true);
    }

    get paging(): number[] {
        var pages = [1, 2, 3, 4, 5];

        if(pages.length >= this.pageTotal){
            pages = pages.splice(0, this.pageTotal);
            return pages;
        }

        var center = Math.floor(pages.length / 2);
        if(this.parameters.page <= pages[center]){
            return pages;
        }

        while(pages[center] !== this.parameters.page && pages[pages.length - 1] < this.pageTotal){
            pages = pages.map(page => ++page);
        }

        return pages;
    }
}
