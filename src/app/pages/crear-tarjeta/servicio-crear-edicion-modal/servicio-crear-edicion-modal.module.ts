import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ServicioCrearEdicionModalComponent} from "./servicio-crear-edicion-modal.component";
import {IonicModule} from "@ionic/angular";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";

@NgModule({
  declarations: [ServicioCrearEdicionModalComponent],
  imports: [
    CommonModule,
    IonicModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class ServicioCrearEdicionModalModule {
}
