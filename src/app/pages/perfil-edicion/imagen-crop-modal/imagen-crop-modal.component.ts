import {Component, Input, OnInit} from '@angular/core';
import {FormControl} from '@angular/forms';
import {ModalController} from '@ionic/angular';
import {ImageCroppedEvent} from "ngx-image-cropper";
import {BehaviorSubject} from "rxjs";

@Component({
  selector: 'app-imagen-crop-modal',
  templateUrl: './imagen-crop-modal.component.html',
  styleUrls: ['./imagen-crop-modal.component.scss'],
})
export class ImagenCropModalComponent implements OnInit {

  @Input() file: any;
  @Input() control: FormControl;
  @Input() label: string;
  aspectRatio = new BehaviorSubject(4 / 4);

  constructor(public modal: ModalController) {
  }

  ngOnInit() {
    this.aspectRatio.next(this.label === 'avatar' ? 16 / 9 : 4 / 4)
  }

  cropImg(e: ImageCroppedEvent) {
    console.log('cropImg')
    this.control.setValue(e?.base64?.split(',')[1] ?? null);
  }

  imgLoad() {
    // display cropper tool
  }

  initCropper() {
    // init cropper
  }

  imgFailed() {
    // error msg
  }

  cancelar() {
    this.control.setValue('');
    this.modal.dismiss();
  }
}
