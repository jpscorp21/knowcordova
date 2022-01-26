import { Injectable } from '@angular/core';
import { ToastOptions } from '@ionic/core';
import { ToastController } from '@ionic/angular';

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  private toast: HTMLIonToastElement;

  constructor(private readonly toastCtrl: ToastController) { }

  async presentToast() {
    const toast = await this.toastCtrl.create({
      message: 'Sincronizando...',
      duration: 2000,
    });
    toast.present();
  }

  /**
   * Crea el toast y lo muestra
   *
   * @param message Mensaje a mostrar
   * @param options Opciones para controlar el toast
   */
  public async create(message: string = '', options: ToastOptions = {}) {
    this.toast = await this.toastCtrl.create({
      message,
      duration: options.duration || 5000,
      position: options.position || 'bottom',
      color: options.color || 'dark',
    });

    await this.toast.present();
  }

  /**
   * Crea el toast y lo muestra
   *
   * @param message Mensaje a mostrar
   * @param options Opciones para controlar el toast
   */
  public async toastClosed(message: string = '', options: ToastOptions = {}) {
    this.toast = await this.toastCtrl.create({
      message,
      position: options.position || 'bottom',
      // color: options.color || 'dark',
      cssClass: 'button-color-changed',
      buttons: [
        {
          side: 'end',
          text: 'Ok',
          role: 'cancel',
        },
      ],
    });

    await this.toast.present();
  }
}
