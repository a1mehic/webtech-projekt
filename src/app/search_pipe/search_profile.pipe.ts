import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'filterProfile',
})

export class FilterProfilePipe implements PipeTransform {
    transform(items: any[], post: any): any {
        if (!items || !post) {
            return items;
        }
        return items.filter(item => item.creator.toLocaleLowerCase().indexOf(post.creator) !== -1);
    }
}
