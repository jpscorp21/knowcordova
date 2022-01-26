import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';


import { PerfilSeguidorPageRoutingModule } from './perfil-seguidor-routing.module';

import { PerfilSeguidorPage } from './perfil-seguidor.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PerfilSeguidorPageRoutingModule
  ],
  declarations: [PerfilSeguidorPage]
})
export class PerfilSeguidorPageModule {}
