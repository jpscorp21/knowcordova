import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ViewasPageRoutingModule } from './viewas-routing.module';

import { ViewasPage } from './viewas.page';
import { ComponentsModule } from 'src/app/components/components.module';
import { PipesModule } from 'src/app/pipes/pipes.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ViewasPageRoutingModule,
    ComponentsModule,
    PipesModule
  ],
  declarations: [ViewasPage]
})
export class ViewasPageModule {}
