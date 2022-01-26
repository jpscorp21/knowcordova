import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {TarjetaRenombrarComponent} from "./tarjeta-renombrar.component";
import {IonicModule} from "@ionic/angular";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {ComponentsModule} from "../components.module";


@NgModule({
  declarations: [TarjetaRenombrarComponent],
  exports: [TarjetaRenombrarComponent],
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ComponentsModule
  ]
})
export class TarjetaRenombrarModule {
}
