import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {IonicModule} from '@ionic/angular';
import {AmigosPageRoutingModule} from './amigos-routing.module';
import {AmigosPage} from './amigos.page';
import {PipesModule} from "../../pipes/pipes.module";
import {TarjetaAmigoModalModule} from "../../components/tarjeta-amigo-modal/tarjeta-amigo-modal.module";
import {AmigosListaModule} from "./components/amigos-lista.module";
import {ComponentsModule} from "../../components/components.module";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AmigosPageRoutingModule,
    PipesModule,
    TarjetaAmigoModalModule,
    AmigosListaModule,
    ComponentsModule
  ],
  declarations: [AmigosPage]
})
export class AmigosPageModule {
}
