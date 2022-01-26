import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

import {IonicModule} from '@ionic/angular';

import {PrivacidadPageRoutingModule} from './privacidad-routing.module';

import {PrivacidadPage} from './privacidad.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PrivacidadPageRoutingModule,
    ReactiveFormsModule
  ],
  declarations: [PrivacidadPage]
})
export class PrivacidadPageModule {
}
