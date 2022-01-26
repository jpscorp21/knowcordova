import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {IonicModule} from '@ionic/angular';
import {PipesModule} from '../pipes/pipes.module';
import {CargandoComponent} from './cargando/cargando.component';
import {TarjetasComponent} from './tarjetas/tarjetas.component';
import {SortablejsModule} from 'ngx-sortablejs'; 
import {ServiciosModalModule} from '../pages/crear-tarjeta/servicios-modal/servicios-modal.module';
import {ServicioEdicionModalModule} from '../pages/crear-tarjeta/servicio-edicion-modal/servicio-edicion-modal.module';
import {KnowHeaderModalComponent} from './know-header-modal/know-header-modal.component';
import {NfcComponent} from './nfc/nfc.component';
import {NgxQRCodeModule} from "@techiediaries/ngx-qrcode";

const components = [
  CargandoComponent,
  TarjetasComponent,
  KnowHeaderModalComponent,
  NfcComponent
];

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    RouterModule,
    PipesModule,
    SortablejsModule,
    ServiciosModalModule,
    ServicioEdicionModalModule,
    NgxQRCodeModule,
  ],
  exports: [...components],
  declarations: [...components],
})
export class ComponentsModule {
}
