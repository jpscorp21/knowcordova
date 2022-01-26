import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { QrPageRoutingModule } from './qr-routing.module';
import { NgxQRCodeModule } from '@techiediaries/ngx-qrcode';

import { QrPage } from './qr.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    NgxQRCodeModule,
    QrPageRoutingModule
  ],
  declarations: [QrPage],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class QrPageModule {}
