import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'replace', pure: false })
export class ReplacePipe implements PipeTransform {
    transform(str: string, expression: string, flags: string, replace: string): string {
        var regex = new RegExp(expression, flags);
        return str.replace(regex, replace);
    }
}