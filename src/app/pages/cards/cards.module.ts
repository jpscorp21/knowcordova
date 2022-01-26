import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';

import {IonicModule} from '@ionic/angular';

import {CardsPageRoutingModule} from './cards-routing.module';
import {SortablejsModule} from 'ngx-sortablejs';

import {CardsPage} from './cards.page';
import {PipesModule} from 'src/app/pipes/pipes.module';
import {ComponentsModule} from '../../components/components.module';
import {ServicioEdicionModalModule} from '../crear-tarjeta/servicio-edicion-modal/servicio-edicion-modal.module';
import {ServiciosModalModule} from '../crear-tarjeta/servicios-modal/servicios-modal.module';
import {TarjetaVercomoModalModule} from "../../components/tarjeta-vercomo-modal/tarjeta-vercomo-modal.module";
import {TarjetaRenombrarModule} from "../../components/tarjeta-renombrar/tarjeta-renombrar.module";
import {TarjetaPopoverModule} from "../../components/tarjeta-popover/tarjeta-popover.module";
import {SwiperModule} from "swiper/angular";
import {CompartirModalModule} from "../../components/compartir-modal/compartir-modal.module";
import {TarjetaQrModalModule} from "../../components/tarjeta-qr-modal/tarjeta-qr-modal.module";
import {TarjetaContactoModalModule} from "../../components/tarjeta-contacto/tarjeta-contacto-modal.module";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CardsPageRoutingModule,
    PipesModule,
    SortablejsModule,
    ComponentsModule,
    ServicioEdicionModalModule,
    ServiciosModalModule,
    TarjetaVercomoModalModule,
    TarjetaRenombrarModule,
    TarjetaPopoverModule,
    TarjetaQrModalModule,
    TarjetaContactoModalModule,
    CompartirModalModule,
    SwiperModule
  ],
  declarations: [CardsPage]
})
export class CardsPageModule {
}
