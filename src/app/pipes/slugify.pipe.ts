import { Pipe, PipeTransform } from '@angular/core';
import { AllHtmlEntities } from 'html-entities';

@Pipe({ name: 'slugify', pure: false })
export class SlugifyPipe implements PipeTransform {
    transform(str: string): string {
        var all = new AllHtmlEntities();

        str = all.decode(str);
        str = str.toLowerCase().replace(/[^a-z0-9\s-]/ig, '');
        str = str.replace(/^\s+|\s+$|\s+(?=\s)/ig, '');
        str = str.replace(/\s/ig, '-');
        str = str.replace(/(-){2,}/ig, '-');
        return str;
    }
}