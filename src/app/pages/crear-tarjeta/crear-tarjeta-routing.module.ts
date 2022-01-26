import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CrearTarjetaPage } from './crear-tarjeta.page';

const routes: Routes = [
  {
    path: '',
    component: CrearTarjetaPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CrearTarjetaPageRoutingModule {}
