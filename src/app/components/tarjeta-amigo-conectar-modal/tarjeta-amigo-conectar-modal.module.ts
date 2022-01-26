import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {IonicModule} from '@ionic/angular';
import {FormsModule} from '@angular/forms';
import {TarjetaAmigoConectarModalComponent} from './tarjeta-amigo-conectar-modal.component';
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
  declarations: [TarjetaAmigoConectarModalComponent],
  exports: [TarjetaAmigoConectarModalComponent]
})
export class TarjetaAmigoConectarModalModule {
}
