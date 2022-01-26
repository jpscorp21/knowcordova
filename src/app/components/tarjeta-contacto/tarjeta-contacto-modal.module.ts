import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {IonicModule} from '@ionic/angular';
import {FormsModule} from '@angular/forms';
import {TarjetaContactoModalComponent} from './tarjeta-contacto-modal.component';
import {PipesModule} from 'src/app/pipes/pipes.module';
import {ComponentsModule} from "../components.module";
import {NgxQRCodeModule} from "@techiediaries/ngx-qrcode";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PipesModule,
    ComponentsModule,
    NgxQRCodeModule,
  ],
  declarations: [TarjetaContactoModalComponent],
  exports: [TarjetaContactoModalComponent]
})
export class TarjetaContactoModalModule {
}
