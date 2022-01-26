import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'emailhidden'
})

export class EmailHiddenPipe implements PipeTransform {
  transform(value: string): any {      
    return value[0] + '*'.repeat(value.substr(2, value.indexOf('@')).length - 2) + value.substr(value.indexOf('@') - 1)[0] + value.substring(value.indexOf('@'));
  }
}
