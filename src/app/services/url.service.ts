import {Injectable} from '@angular/core';
import { AndroidPermissions } from '@awesome-cordova-plugins/android-permissions/ngx';
import { CallNumber } from '@awesome-cordova-plugins/call-number/ngx';
import {Platform} from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class UrlService {

  constructor(
    private callNumber: CallNumber, 
    private androidPermissions: AndroidPermissions,
    public platform: Platform) {
  }
  

  abrirUrl(prefix: string, value: any) {
    if (prefix.trim() == "addtocontacts") {
      return this.callContact(value);
    }

    const link = document.createElement('a');
    link.href = prefix + value;
    link.target = "_blank";
    link.click();
  }

  async callContact(number: string) {

    if (this.platform.is('android')) {

      const { hasPermission } = await this.androidPermissions.checkPermission(
        this.androidPermissions.PERMISSION.CALL_PHONE
      );

      if (!hasPermission) {
        const result = await this.androidPermissions.requestPermission(
          this.androidPermissions.PERMISSION.CALL_PHONE
        );

        if (!result.hasPermission) {
          throw new Error('Permiso requerido');
        }        

        if (this.callNumber.isCallSupported()) {
          this.callNumber.callNumber(number, true);
        }

      } else {
        if (this.callNumber.isCallSupported()) {
          this.callNumber.callNumber(number, true);
        }
      }
      

      // TODO - Cambiar modulo contacto de capacitor a cordova

      // const permission = await Contacts.getPermissions();

      // if (permission.granted) {
      //   if (this.callNumber.isCallSupported()) {
      //     this.callNumber.callNumber(number, true);
      //   }
      // }
    }
  }
}
