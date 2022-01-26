import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filtro'
})
export class FiltroPipe implements PipeTransform {

  filtroAux: any[];

  transform(arreglo: any[],
    texto: string,
    columna1: string,
    textoChip?: any,
    columna2?: string,
    textoUbicacion?: string,
    columna3?: string): any[] {

    if (textoUbicacion === '' || textoUbicacion === 'cerca' || textoUbicacion === undefined) {
      this.filtroAux = arreglo;
    } else {
      this.filtroAux = this.filtro(arreglo, columna3, textoUbicacion);
    }

    if (textoChip !== []) {

      this.filtroAux = this.filtroAux.filter(item => {
        let incluye = true;
        textoChip.forEach(x => {
          if (item[columna2]) {
            if (item[columna2]/* .join(' ') */.includes(x) === false) {
              incluye = false;
              return;
            }
          } else {
            incluye = false;
          }
        })
        return incluye;
      })
    }

    if (texto !== '' && texto !== undefined) {
      this.filtroAux = this.filtro(this.filtroAux, columna1, texto);
    }

    return this.filtroAux;

  }

  filtro(array, columna, texto) {
    return array.filter(item => {
      return item[columna].toLowerCase().includes(texto.toLowerCase())
    })
  }


}
