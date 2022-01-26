import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';

import {IonicModule} from '@ionic/angular';

import {TabsPageRoutingModule} from './tabs-routing.module';

import {TabsPage} from './tabs.page';
import {TarjetaQrModalModule} from "../../components/tarjeta-qr-modal/tarjeta-qr-modal.module";
import {TarjetaCompartirModalModule} from "../../components/tarjeta-compartir-modal/tarjeta-compartir-modal.module";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TabsPageRoutingModule,
    TarjetaQrModalModule,
    TarjetaCompartirModalModule
  ],
  declarations: [TabsPage]
})
export class TabsPageModule {
}
