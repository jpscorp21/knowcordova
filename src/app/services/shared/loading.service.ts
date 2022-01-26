import { Injectable } from '@angular/core';
import { LoadingController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {

  constructor(
    private readonly loadingCtrl: LoadingController
  ) { }

  async createCircle(message: string, spinner: any = 'circles'): Promise<HTMLIonLoadingElement> {
    const loading = await this.loadingCtrl.create({ message, spinner });
    await loading.present();
    return loading;
  }
}
