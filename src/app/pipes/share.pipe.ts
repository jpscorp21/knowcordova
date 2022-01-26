import {Pipe, PipeTransform} from '@angular/core';
import {TarjetaServicio} from "../interfaces/interface";

@Pipe({
  name: 'share'
})

export class SharePipe implements PipeTransform {
  transform(value: TarjetaServicio[]): any {
    return value.filter((item) => item.share)
  }
}
