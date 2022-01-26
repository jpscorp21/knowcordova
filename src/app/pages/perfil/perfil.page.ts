import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {SelectiveLoadingStrategy} from 'src/app/selective-loading-strategy';
import {PerfilService} from 'src/app/services/perfil.service';
import {PERFIL_KEY} from 'src/app/util/constants';
declare var cordova: any; 
import {PersonaCount} from 'src/app/interfaces/interface';
import {BehaviorSubject, Subscription} from 'rxjs';
import { AlertService } from 'src/app/services/shared/alert.service';
import { QRService } from 'src/app/services/qr.service';
import { QRSampleService } from 'src/app/services/qr.sample.service';
import { NfcService } from 'src/app/services/nfc.service';
import { Platform } from '@ionic/angular';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.page.html',
  styleUrls: ['./perfil.page.scss'],
})
export class PerfilPage implements OnInit {

  subscriptionExit = new Subscription();

  constructor(    
    public perfil: PerfilService,
    private readonly router: Router,
    private readonly alert: AlertService,
    private loader: SelectiveLoadingStrategy,    
    private readonly qr: QRService,
    private readonly nfc: NfcService,
    private readonly platform: Platform
  ) {
  }

  ngOnInit() {

    this.loader.preLoadRoute('privacidad');
    this.loader.preLoadRoute('tutorial');
    this.loader.preLoadRoute('acercade');
    this.loader.preLoadRoute('viewas');
    this.loader.preLoadRoute('reset-password');    

  }

  friendCount$ = new BehaviorSubject<PersonaCount | undefined>(undefined);

  async ionViewDidEnter() {
    /*if (this.perfil.perfil) {
      const res = await this.auth.frientCount(this.perfil.perfil.id).toPromise();
      this.friendCount$.next(res);
    }*/

    /*this.friendCount$ = this.perfil.perfil$.pipe(
      switchMap(async (perfil) => {
        if (!perfil) {
          return null;
        }
        const res = await this.auth.frientCount(perfil.id).toPromise();
        return res;
      }),
      share(),
      shareReplay()
    )*/    
    this.subscriptionExit = this.platform.backButton.subscribe(() => {
      // if (this.router.url.indexOf('cards') > -1) {      
        const tarjetaSelected = this.perfil.perfil?.idtarjetaselected ?? 0  
        if (tarjetaSelected) {
          this.router.navigateByUrl('/tabs/cards/' + tarjetaSelected);
        } else {
          this.router.navigateByUrl('/tabs/cards/0');
        }
      // }      
    }); 
  }

  editarPerfil() {
    this.router.navigateByUrl('/tabs/perfil-edicion');
  }

  logout() {
    localStorage.removeItem(PERFIL_KEY);
    this.perfil.initPerfil();
    this.router.navigateByUrl('/');
  }

  salir() {
    this.alert.alertOk('Deseas salir de la aplicación?').then((value) => {
      if (value) {
        // tslint:disable-next-line:no-string-literal
        navigator['app'].exitApp();
      }
    });
  }

  async verTerminos() {    
    if (cordova) {
      cordova.InAppBrowser.open(`http://knownfc.com/knowcontent/terms.pdf`, '_system', 'location=yes,beforeload=yes');                    
    }
  }

  async openQrScanner() {
    const barcode = await this.qr.openQrScanner() as any;                
    if (barcode && barcode.text) {
      const [usuario, idtarjeta] = barcode.text.split('/')[4].split('.');
      this.nfc.openTarjetaAmigoConectar({usuario, idtarjeta: Number(idtarjeta)})
    }        
  }

  ngOnDestroy() {    
    this.subscriptionExit.unsubscribe();
  }
}
