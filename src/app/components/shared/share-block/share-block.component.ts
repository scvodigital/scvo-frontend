import { Component, Input } from '@angular/core';

@Component({
  selector: 'share-block',
  templateUrl: './share-block.component.html'
})
export class ShareBlockComponent {
    constructor() {}

    @Input() totalShare: number;

    sumCounts(count){
        this.totalShare += count;
    }
}
