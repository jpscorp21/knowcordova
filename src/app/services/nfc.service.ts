import {Injectable} from '@angular/core';
// import {Ndef, NFC} from '@ionic-native/nfc/ngx';
import {AlertController, ModalController, Platform} from '@ionic/angular';
import {Subscription, Observable, BehaviorSubject} from 'rxjs';
import {ToastService} from './shared/toast.service';
import {TagsService} from './tags.service';
import {fromPromise} from "rxjs/internal-compatibility";
import { Ndef, NFC, NfcUtil } from '@awesome-cordova-plugins/nfc/ngx';
import { TarjetaAmigoConectarModalComponent } from '../components/tarjeta-amigo-conectar-modal/tarjeta-amigo-conectar-modal.component';

@Injectable({
  providedIn: 'root',
})
export class NfcService {

  subscriptions: Array<Subscription> = new Array<Subscription>();
  subscripcion: Subscription[] = [];
  ready = new BehaviorSubject(false);
  alertInstance: HTMLIonAlertElement;

  constructor(private nfcCtrl: NFC,
              private ndef: Ndef,
              private util: NfcUtil,
              public alertController: AlertController,
              private toast: ToastService,
              private modal: ModalController,
              private tagService: TagsService,
              private platform: Platform) {

      // this.platform.ready().then(() => {
      //   this.ready.next(true);
      // })
  }

  leerTagAndroid() {
    // if (await this.nfcEnabled()) {
    // await this.presentAlert()

    // TODO - Retornar nfc
    return this.nfcCtrl.addNdefListener();

    /*return this.nfcCtrl.addNdefListener((data) => {
      console.log('activaste?')
      console.log(data);
    })*/
    // }
  }

  leerTagIOS() {



    //eturn this.nfcCtrl.addTagDiscoveredListener(onNfc, win, fail);
    // TODO - Retornar nfc
    return this.nfcCtrl.addTagDiscoveredListener();

    /*return this.nfcCtrl.addNdefListener((data) => {
      console.log('activaste?')
      console.log(data);
    })*/
    // }
  }

  leerTagIos() {
    // TODO - Retornar nfc en leer tagIOS
    return this.nfcCtrl.scanTag({keepSessionOpen: true});
  }

  escribirTag(nfcMsg: any) {
      this.presentAlert("Apoye el dispositivo junto al tag")
      let ndefMsg = this.ndef.textRecord(nfcMsg);
      this.nfcCtrl.addNdefListener(() => {
        alert('successfully attached ndef listener');
      }, (err) => {
        this.alertController.dismiss()
        this.toast.create('Ocurrio un error en la lectura, vuelva a intentarlo', {duration: 3000})
      }).subscribe(() => {
          this.nfcCtrl.write([ndefMsg])
          .then(() => {
            this.alertController.dismiss()
            this.toast.create('Se ha escrito con exito', {duration: 3000})
            this.unsubscribeNfc()
          })
          .catch(err => {
            this.alertController.dismiss()
            this.unsubscribeNfc()
            alert(JSON.stringify(err))
          });
        }, err => {
          this.alertController.dismiss()
          console.log(err)
          this.alertController.dismiss();
          this.unsubscribeNfc()
        }
      );
    }

  unsubscribeNfc() {
      this.subscriptions.forEach(sub => {
        sub.unsubscribe();
      });
  }

  async presentAlert(message: string) {
    this.alertInstance = await this.alertController.create({
      cssClass: 'my-custom-class',
      message: `<div style="padding-bottom: 10px">${message}</div><br><br><ion-spinner style="margin-top: 5px !important;" name="crescent" class="center"> </ion-spinner>`,
      backdropDismiss: false,
      buttons: ['Cancelar']
    });

    await this.alertInstance.present();

    const {role} = await this.alertInstance.onDidDismiss();
    if (role === 'Cancel') {
      // await this.alertController.dismiss()
      await this.alertInstance.dismiss();
    }

    return this.alertInstance;
  }

  async alertDismiss() {
    await this.alertInstance.dismiss();
  }

  async nfcEnabled() {
    try {
      // await this.nfcCtrl.enabled()
      return true
    } catch (e) {
      console.log(e);
      return false
    }
  }

  nfcFromTag() {
    // if (this.ready.getValue()) {

      let subscription = new Subscription();

      subscription = this.nfcCtrl.addMimeTypeListener('http').subscribe((data) => {
        console.log("NFC ABRA CADABRA", data);
        const message = this.util.bytesToString((data.tag?.ndefMessage[0]?.payload));

        const [usuario, idtarjeta] = message.split('/')[2].split('.');
        this.openTarjetaAmigoConectar({usuario, idtarjeta: Number(idtarjeta)})
      });

      this.subscripcion.push(subscription);

    //}
  }

  async nfcFromTagUnsubscripcion() {
    this.subscripcion.map((subscripcion) => subscripcion.unsubscribe())
    this.subscripcion = []
  }

  async openTarjetaAmigoConectar(data: { usuario: string, idtarjeta: number }) {
    const modal = await this.modal.create({
      component: TarjetaAmigoConectarModalComponent,
      mode: 'ios',
      componentProps: data
    });

    await modal.present();
  }
}
