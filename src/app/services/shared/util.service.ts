import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UtilService {

  constructor() {
  }

  styleImg(url: string) {
    return `linear-gradient(360deg, #000000 0%, rgba(0, 0, 0, 0) 40%), url(data:image/jpeg;base64,${url}) center no-repeat`;
    // return `linear-gradient(360deg, #000000 0%, rgba(0, 0, 0, 0) 40%), url(/assets/imagenes/headerViewas.png) center no-repeat`;
  }

  styleImg2(url: string) {
    return `url(${url}) center no-repeat`;
    // return `linear-gradient(360deg, #000000 0%, rgba(0, 0, 0, 0) 40%), url(/assets/imagenes/headerViewas.png) center no-repeat`;
  }

  styleImgDefault(url: string) {
    return `url(${url}) center no-repeat`;
    // return `linear-gradient(360deg, #000000 0%, rgba(0, 0, 0, 0) 40%), url(/assets/imagenes/headerViewas.png) center no-repeat`;
  }

  styleImgWithData(url: string) {
    return `url(data:image/jpeg;base64,${url}) center no-repeat`;
    // return `linear-gradient(360deg, #000000 0%, rgba(0, 0, 0, 0) 40%), url(/assets/imagenes/headerViewas.png) center no-repeat`;
  }
}
