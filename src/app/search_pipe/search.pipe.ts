import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'filterPosts',
})

export class FilterPipe implements PipeTransform {
    transform(items: any[], post: any): any {
        if (!items || !post) {
            return items;
        }
        return items.filter(item => item.title.toLocaleLowerCase().indexOf(post.title) !== -1);
    }
}
