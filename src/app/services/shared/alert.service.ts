import {Injectable} from '@angular/core';
import {AlertController} from '@ionic/angular';
import {AlertOptions} from '@ionic/core';

@Injectable({
  providedIn: 'root'
})
export class AlertService {

  private alert: HTMLIonAlertElement;

  constructor(
    private readonly alertCtrl: AlertController
  ) {
  }

  /**
   * Muestra un mensaje con dos opciones aceptar o cancelar
   *
   * @param message Mensaje
   * @param options Opciones del alerta
   * @returns True si acepto, lo contrario false
   */
  async alertOk(message: string, options: AlertOptions = {}) {
    this.alert = await this.alertCtrl.create({
      header: options.header || 'Mensaje del Sistema',
      message,
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          handler: () => false
        },
        {
          text: 'Aceptar',
          role: 'aceptar',
          handler: () => true
        },

      ]
    });

    await this.alert.present();

    const {role} = await this.alert.onDidDismiss();

    return role !== 'cancel' && role !== 'backdrop';
  }

  /**
   * Muestra un mensaje con dos opciones aceptar o cancelar
   *
   * @param message Mensaje
   * @param options Opciones del alerta
   * @returns True si acepto, lo contrario false
   */
  async alertMessage(message: string, options: AlertOptions = {}) {
    this.alert = await this.alertCtrl.create({
      header: options.header || 'Mensaje del Sistema',
      message,
      buttons: [
        {
          text: 'Aceptar',
          role: 'aceptar',
          handler: () => true
        }
      ]
    });

    await this.alert.present();

    const {role} = await this.alert.onDidDismiss();

    return role !== 'cancel' && role !== 'backdrop';
  }

  /**
   * Muestra un mensaje utilizado normalmente para advertencia
   *
   * @param message Mensaje para el alerta
   * @param header Encabezado
   */
  async show(message: string, header?: string) {
    this.alert = await this.alertCtrl.create({
      header: header || 'Mensaje del Sistema',
      message,
      buttons: [
        {
          text: 'Aceptar',
          role: 'aceptar',
          handler: () => true
        }
      ]
    });

    await this.alert.present();
  }
}
