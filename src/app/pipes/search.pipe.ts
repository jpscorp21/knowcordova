import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'search'
})
export class SearchPipe implements PipeTransform {

  transform<T>(value: T[], search: string, key: string): T[] {
    if (!search) {
      return value;
    }

    if (!Array.isArray(value)) {
      return [];
    }

    return value.filter(item => (item[key] as string).toLowerCase().trim().indexOf(search.toLowerCase().trim()) > -1);
  }

}
