import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'galeria'
})
export class GaleriaPipe implements PipeTransform {

  transform(array: any[]): any[] {
    const filtrado = array.filter( x => x.aprobado)

    return filtrado;
  }

}
