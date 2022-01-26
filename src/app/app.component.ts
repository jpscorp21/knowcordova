import { Component, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController, Platform } from '@ionic/angular';
import { TarjetaAmigoConectarModalComponent } from './components/tarjeta-amigo-conectar-modal/tarjeta-amigo-conectar-modal.component';
import { AmigosService } from './services/amigos.service';
import { PerfilService } from './services/perfil.service';
import { ServiciosService } from './services/servicios.service';
import { StorageService } from './services/storage.service';
import { TarjetasService } from './services/tarjetas.service';
import { TarjetaservicioService } from './services/tarjetaservicio.service';
import { StatusBar } from '@awesome-cordova-plugins/status-bar/ngx';
import { SplashScreen } from '@awesome-cordova-plugins/splash-screen/ngx';
import { Deeplinks } from '@awesome-cordova-plugins/deeplinks/ngx';
import { Subscription } from 'rxjs';
import { NfcService } from './services/nfc.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {

  subscripcion: Subscription = new Subscription();


  constructor(
    public readonly perfil: PerfilService,
    public readonly servicios: ServiciosService,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private deeplinks: Deeplinks,
    public tarjetas: TarjetasService,
    public amigos: AmigosService,
    public tarjtasServicios: TarjetaservicioService,
    public ngZone: NgZone,    
    public nfc: NfcService,
    public storage: StorageService,
    public platform: Platform,
    private modal: ModalController,
    public router: Router,
  ) {
    this.ngZone.run(() => {
      // this.deepLinks();
      
    })
  }
 
  ngOnInit() {
    this.platform.ready().then(async () => {
      this.initializeApp();
      if (this.platform.is('android') || this.platform.is('ios')) {
        this.statusBar.styleBlackOpaque();
        this.splashScreen.hide();        
      }
      
      this.perfil.initPerfil();
      this.servicios.getAllProxy();
  
      const tarjetas = await this.storage.get('tarjetas');
  
      if (tarjetas) {
        this.tarjetas.setTarjetasByPersona(tarjetas);
      } else {
        this.tarjetas.resetByPersona();
      }
  
      this.perfil.changePerfilAction$.subscribe(async (perfil) => {
        if (perfil && perfil.id) {
          this.amigos.resetByPersona();
          this.amigos.getByPersonaProxy(perfil.id);
          this.tarjetas.getByPersonaProxy(perfil.id);
  
  
        }
      })      
    })    
  }

  initializeApp() {
    /*const url = "http://knownfc.com/profile/3648151.2";
    const [usuario, idtarjeta] = url.split('/')[4].split('.');
    this.openTarjetaAmigoConectar({usuario, idtarjeta: Number(idtarjeta)})*/

    this.deeplinks.route({}).subscribe(match => {
      console.log('Funcionando')
      console.log(match); 
    }, nomatch => {
      console.log(nomatch);
      console.log(nomatch.$link);
      
      // if (!nomatch || nomatch.$link || !nomatch.$link.url) {
      //   return;
      // }

      const [usuario, idtarjeta] = nomatch.$link.url.split('/')[4].split('.');
      this.openTarjetaAmigoConectar({usuario, idtarjeta: Number(idtarjeta)})
      
      
    })
    
    this.nfc.nfcFromTag();    
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
