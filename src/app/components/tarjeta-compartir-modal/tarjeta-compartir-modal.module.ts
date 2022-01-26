import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {IonicModule} from '@ionic/angular';
import {FormsModule} from '@angular/forms';
import {TarjetaCompartirModalComponent} from './tarjeta-compartir-modal.component';
import {PipesModule} from 'src/app/pipes/pipes.module';
import {ComponentsModule} from "../components.module";
import {NgxQRCodeModule} from "@techiediaries/ngx-qrcode";
import {NgxVcardModule} from "ngx-vcard";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PipesModule,
    ComponentsModule,
    NgxQRCodeModule,
    NgxVcardModule,
  ],
  declarations: [TarjetaCompartirModalComponent],
  exports: [TarjetaCompartirModalComponent]
})
export class TarjetaCompartirModalModule {
}
