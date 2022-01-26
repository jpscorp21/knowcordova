import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

import {IonicModule} from '@ionic/angular';

import {PerfilEdicionPageRoutingModule} from './perfil-edicion-routing.module';

import {PerfilEdicionPage} from './perfil-edicion.page';
import {ImageCropperModule} from "ngx-image-cropper";
import {ImagenCropModalModule} from './imagen-crop-modal/imagen-crop-modal.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    PerfilEdicionPageRoutingModule,
    ImageCropperModule,
    ImagenCropModalModule
  ],
  declarations: [PerfilEdicionPage]
})
export class PerfilEdicionPageModule {
}
