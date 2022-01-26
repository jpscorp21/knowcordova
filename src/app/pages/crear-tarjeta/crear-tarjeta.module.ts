import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

import {IonicModule} from '@ionic/angular';

import {CrearTarjetaPageRoutingModule} from './crear-tarjeta-routing.module';

import {CrearTarjetaPage} from './crear-tarjeta.page';
import {ServiciosModalModule} from './servicios-modal/servicios-modal.module';
import {ServicioCrearEdicionModalModule} from "./servicio-crear-edicion-modal/servicio-crear-edicion-modal.module";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CrearTarjetaPageRoutingModule,
    ReactiveFormsModule,
    ServiciosModalModule,
    ServicioCrearEdicionModalModule
  ],
  declarations: [CrearTarjetaPage]
})
export class CrearTarjetaPageModule {
}
