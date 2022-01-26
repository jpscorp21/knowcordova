import {NgModule} from '@angular/core';
import {FiltroPipe} from './filtro.pipe';
import {GaleriaPipe} from './galeria.pipe';
import {GaleriaLocalPipe} from './galeria-local.pipe';
import {FechaHoraPipe} from './fecha-hora.pipe';
import {SafeHtmlPipe} from './safeHtml.pipe';
import {EmptyPipe} from './empty.pipe';
import {CantidadSortPipe} from './cantidadSort.pipe';
import {OrdenPipe} from './orden.pipe';
import {EmailHiddenPipe} from './emailhidden.pipe';
import {SearchPipe} from './search.pipe';
import {SharePipe} from "./share.pipe";
import { PendientePipe } from './pendiente.pipe';

const pipes = [
  FiltroPipe,
  GaleriaPipe,
  GaleriaLocalPipe,
  FechaHoraPipe,
  SafeHtmlPipe,
  EmptyPipe,
  CantidadSortPipe,
  OrdenPipe,
  EmailHiddenPipe,
  SearchPipe,
  SharePipe,
  PendientePipe
];

@NgModule({
  imports: [],
  exports: [...pipes],
  declarations: [...pipes,],
})
export class PipesModule {
}
