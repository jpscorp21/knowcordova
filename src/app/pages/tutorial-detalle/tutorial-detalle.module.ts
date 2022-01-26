import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

import {IonicModule} from '@ionic/angular';

import {TutorialDetallePageRoutingModule} from './tutorial-detalle-routing.module';

import {TutorialDetallePage} from './tutorial-detalle.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TutorialDetallePageRoutingModule,
    ReactiveFormsModule
  ],
  declarations: [TutorialDetallePage]
})
export class TutorialDetallePageModule {
}
