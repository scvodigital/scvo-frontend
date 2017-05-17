import { Component, ElementRef } from '@angular/core';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Rx';
import { AppService } from '../../services/app.service';
import { ElasticService, IHits, IDocument, IHit, ISearchParameters } from '../../services/elastic.service';

@Component({
    selector: 'main-container.content',
    templateUrl: './library-detail.component.html'
})
export class LibraryDetailComponent {
    public hits: IHit<IDocument>[] = [];

    public documents: IHit<IDocument>[];

    constructor (router: Router, private appService: AppService) {
        router.events.forEach((event) => {
            if (event instanceof NavigationEnd) {
                var path = '/library/';
                if (event.url.startsWith(path)) {
                    var slug = event.url.substr(path.length);
                    var params;

                    this.appService.es.getDocument(slug).then((results) => {
                        // console.log(results);
                        this.documents = results.hits;
                    }).catch(err => {
                        console.error('Error searching', slug, err);
                    });
                }
            }
        });
    }
}
