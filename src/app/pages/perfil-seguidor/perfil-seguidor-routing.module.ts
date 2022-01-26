import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PerfilSeguidorPage } from './perfil-seguidor.page';

const routes: Routes = [
  {
    path: '',
    component: PerfilSeguidorPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PerfilSeguidorPageRoutingModule {}
