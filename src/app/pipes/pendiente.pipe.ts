import { Pipe, PipeTransform } from '@angular/core';
import { PersonaAmigo } from '../interfaces/interface';

@Pipe({
  name: 'pendiente'
})

export class PendientePipe implements PipeTransform {
  transform(value: PersonaAmigo[], esPendiente = true): any {    
    return esPendiente ? value.filter((item) => item.followerfechaconectado === 'null')
    : value.filter((item) => item.followerfechaconectado !== 'null')
  }
}
