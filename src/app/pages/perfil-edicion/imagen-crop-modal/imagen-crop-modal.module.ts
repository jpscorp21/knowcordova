import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ImagenCropModalComponent} from './imagen-crop-modal.component';
import {IonicModule} from "@ionic/angular";
import {ImageCropperModule} from "ngx-image-cropper";
import {FormsModule, ReactiveFormsModule} from '@angular/forms';


@NgModule({
  declarations: [ImagenCropModalComponent],
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ImageCropperModule
  ]
})
export class ImagenCropModalModule {
}
