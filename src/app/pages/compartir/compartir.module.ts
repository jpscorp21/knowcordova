import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';

import {IonicModule} from '@ionic/angular';

import {CompartirPageRoutingModule} from './compartir-routing.module';

import {CompartirPage} from './compartir.page';
import {NgxVcardModule} from "ngx-vcard";
import {PipesModule} from "../../pipes/pipes.module";
import {OrdenPipe} from "../../pipes/orden.pipe";


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CompartirPageRoutingModule,
    NgxVcardModule,
    PipesModule
  ],
  declarations: [CompartirPage],
  providers: [OrdenPipe]
})
export class CompartirPageModule {
}
