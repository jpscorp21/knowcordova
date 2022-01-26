import { Pipe, PipeTransform } from '@angular/core';
import { TarjetaServicio } from '../interfaces/interface';

@Pipe({
  name: 'orden'
})

export class OrdenPipe implements PipeTransform {
  transform(value: TarjetaServicio[]): any {
    value.sort((valor1, valor2) => valor1.orden > valor2.orden ? 1 : -1);
    return value;
  }
}
