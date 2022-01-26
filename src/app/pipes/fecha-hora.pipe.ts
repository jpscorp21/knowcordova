import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'fechaHora'
})
export class FechaHoraPipe implements PipeTransform {

  transform(value: any): any  {
    
    const dia = new Date(value).getDate()
    const mes = this.mes(new Date(value).getMonth() + 1)
    const anho = new Date(value).getFullYear()
    const hora = new Date(value).getHours()
    let min = new Date(value).getMinutes().toString()

    if (Number(min) < 10) {
      min = '0' + min
    }
    
    return `${dia} ${mes}. ${anho} - ${hora}:${min} hs.`;
  }

  mes(value) {
    switch (value) {
      case 1:
        return 'ene'
      case 2:
        return 'feb'
      case 3:
        return 'mar'
      case 4:
        return 'abr'
      case 5:
        return 'may'
      case 6:
        return 'jun'
      case 7:
        return 'jul'
      case 8:
        return 'ago'
      case 9:
        return 'sep'
      case 10:
        return 'oct'
      case 11:
        return 'nov'
      case 12:
        return 'dic'
      default:
        break;
    }
  }

}
