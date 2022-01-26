import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {IonicModule} from '@ionic/angular';
import {FormsModule} from '@angular/forms';
import {TarjetaVercomoModalComponent} from './tarjeta-vercomo-modal.component';
import {PipesModule} from 'src/app/pipes/pipes.module';
import {ComponentsModule} from "../components.module";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PipesModule,
    ComponentsModule
  ],
  declarations: [TarjetaVercomoModalComponent],
  exports: [TarjetaVercomoModalComponent]
})
export class TarjetaVercomoModalModule {
}
