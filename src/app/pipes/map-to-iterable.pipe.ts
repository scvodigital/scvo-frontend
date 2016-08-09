import { Pipe } from '@angular/core';

@Pipe({
    name: 'mapToIterable'
})
export class MapToIterablePipe {
    transform(dict: Object): Array<any> {
        var a = [];
        for (var key in dict) {
            if (dict.hasOwnProperty(key)) {
                a.push({key: key, val: dict[key]});
            }
        }
        return a;
    }
}
