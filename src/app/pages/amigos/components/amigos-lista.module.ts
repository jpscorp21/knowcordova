import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {IonicModule} from '@ionic/angular';
import {FormsModule} from '@angular/forms';
import {PipesModule} from 'src/app/pipes/pipes.module';
import {AmigosListaComponent} from "./amigos-lista.component";
import {ComponentsModule} from 'src/app/components/components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PipesModule,
    ComponentsModule,
    PipesModule
  ],
  declarations: [AmigosListaComponent],
  exports: [AmigosListaComponent]
})
export class AmigosListaModule {
}
