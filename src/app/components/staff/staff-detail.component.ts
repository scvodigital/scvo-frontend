import { Component, ElementRef } from '@angular/core';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Rx';
import { AppService } from '../../services/app.service';
import { ElasticService, IHits, IDocument, IHit, ISearchParameters } from '../../services/elastic.service';

@Component({
    selector: 'main-container.content',
    templateUrl: './staff-detail.component.html'
})
export class StaffDetailComponent {
    public hits: IHit<IDocument>[] = [];

    public staffList: IHit<IDocument>[];

    constructor (router: Router, private appService: AppService) {
        router.events.forEach((event) => {
            if (event instanceof NavigationEnd) {
                var path = '/about/staff/';
                if (event.url.startsWith(path)) {
                    var slug = event.url.substr(path.length);
                    var params;

                    this.appService.es.getResult('staff-directory', 'staff-member', slug).then((results) => {
                        console.log(results);
                        this.staffList = results.hits;
                    }).catch(err => {
                        console.error('Error searching', slug, err);
                    });
                }
            }
        });
    }
}
