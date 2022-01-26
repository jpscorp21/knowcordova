import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AutenticacionPageRoutingModule } from './autenticacion-routing.module';

import { AutenticacionPage } from './autenticacion.page';
import { DirectivessModule } from 'src/app/directives/directives.module';
import { PipesModule } from 'src/app/pipes/pipes.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AutenticacionPageRoutingModule,
    DirectivessModule,
    PipesModule
  ],
  declarations: [AutenticacionPage]
})
export class AutenticacionPageModule {}
