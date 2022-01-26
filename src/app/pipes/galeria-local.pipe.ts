import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'galeriaLocal'
})
export class GaleriaLocalPipe implements PipeTransform {

  transform(array: any[], id: number): any[] {
    const data = array.find(x => x.idlocal === id)
    if (data) {
      var ret = [data.razonsocial, String(data.distancia)]
      return ret;  
    }
    return null;
  }

}
