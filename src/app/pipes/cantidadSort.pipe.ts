import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'cantidadSort'
})

export class CantidadSortPipe implements PipeTransform {
  transform(arr: any[]): any {

    return arr.sort((val1: any, val2: any) => {
      if (!val1.distancia || !val2.distancia) {
        return -1;
      }
      return Number(val1.distancia) >= Number(val2.distancia) ? 1 : -1;
    });
  }
}
