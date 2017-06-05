import { Component, ElementRef } from '@angular/core';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Rx';
import { AppService } from '../../services/app.service';
import { ElasticService, IHits, IDocument, IHit, ISearchParameters } from '../../services/elastic.service';

@Component({
    selector: 'main-container.content',
    templateUrl: './event-detail.component.html'
})
export class EventDetailComponent {
    public hits: IHit<IDocument>[] = [];

    public events: IHit<IDocument>[];

    constructor (router: Router, private appService: AppService) {
        router.events.forEach((event) => {
            if (event instanceof NavigationEnd) {
                var path = '/services/events/';
                if (event.url.startsWith(path)) {
                    var slug = event.url.substr(path.length);
                    var params;

                    this.appService.es.getResult('events', 'event', slug).then((results) => {
                        console.log(results);
                        this.events = results.hits;
                    }).catch(err => {
                        console.error('Error searching', slug, err);
                    });
                }
            }
        });
    }
}
