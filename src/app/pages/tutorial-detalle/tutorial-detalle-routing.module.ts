import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TutorialDetallePage } from './tutorial-detalle.page';

const routes: Routes = [
  {
    path: '',
    component: TutorialDetallePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TutorialDetallePageRoutingModule {}
