import {Injectable} from '@angular/core';
import { Camera, CameraOptions } from '@awesome-cordova-plugins/camera/ngx';

@Injectable({
  providedIn: 'root'
})
export class CameraService {

  constructor(
    private camera: Camera
  ) {
  }

  public async takePhoto(options?: CameraOptions) { // TODO - ImageOptions parameter
    const capturedPhoto = await this.camera.getPicture({
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      sourceType: this.camera.PictureSourceType.CAMERA,
      targetHeight: options.targetHeight || 607,
      targetWidth: options.targetWidth || 1080,
      allowEdit: false,
      quality: 70,
     });

    console.log('capturedPhoto', capturedPhoto);


    return 'data:image/jpeg;base64,' + capturedPhoto;
  }

  public async takeFromAlbum(options?: CameraOptions) {
    const capturedPhoto = await this.camera.getPicture({
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
      targetHeight: options.targetHeight || 607,
      targetWidth: options.targetWidth || 1080,
      allowEdit: false,
      quality: 70,
     });
    // const capturedPhoto = await Camera.getPhoto({
    //   resultType: CameraResultType.Base64,
    //   source: CameraSource.Photos,
    //   height: options.height || 607,
    //   width: options.width || 1080,
    //   allowEditing: false,
    //   quality: 70,
    // });

     console.log('capturedPhoto', capturedPhoto);

    return 'data:image/jpeg;base64,' + capturedPhoto;
  }
}
