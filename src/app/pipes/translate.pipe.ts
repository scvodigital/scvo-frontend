import { Pipe, PipeTransform } from '@angular/core';
import { AppService } from '../services/app.service';

@Pipe({ name: 'translate', pure: false })
export class TranslatePipe implements PipeTransform {
    constructor(private appService: AppService) {}

    transform(key: string, language?: string): string {
        var translated = language ?
            this.appService.getSpecificPhrase(key, language) :
            this.appService.getPhrase(key);

        return translated || key;
    }
}
