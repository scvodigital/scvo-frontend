import { Pipe, PipeTransform } from '@angular/core';

declare var markdown: any;

@Pipe({
    name: 'markdown'
})
export class MarkdownPipe implements PipeTransform {
    transform(md: string): string {
        if (typeof md === 'string') {
            return markdown.parse(md);
        } else {
            return '';
        }
    }
}
