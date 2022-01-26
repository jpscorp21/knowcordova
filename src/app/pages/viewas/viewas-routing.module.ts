import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ViewasPage } from './viewas.page';

const routes: Routes = [
  {
    path: '',
    component: ViewasPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ViewasPageRoutingModule {}
