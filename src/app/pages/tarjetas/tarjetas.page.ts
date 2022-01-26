import {Component, NgZone, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {Persona, Tarjeta} from 'src/app/interfaces/interface';
import {SelectiveLoadingStrategy} from 'src/app/selective-loading-strategy';
import {AuthService} from 'src/app/services/auth.service';
import {PerfilService} from 'src/app/services/perfil.service';
import {ServiciosService} from 'src/app/services/servicios.service';
import {UtilService} from 'src/app/services/shared/util.service';
import {TarjetasService} from 'src/app/services/tarjetas.service';
import {TarjetaservicioService} from 'src/app/services/tarjetaservicio.service';
import {PERFIL_KEY} from 'src/app/util/constants';

@Component({
  selector: 'app-tarjetas',
  templateUrl: './tarjetas.page.html',
  styleUrls: ['./tarjetas.page.scss'],
})
export class TarjetasPage implements OnInit {

  constructor(
    public perfil: PerfilService,
    public tarjetas: TarjetasService,
    public tarjtasServicios: TarjetaservicioService,
    public servicios: ServiciosService,
    public router: Router,
    private loader: SelectiveLoadingStrategy,
    public util: UtilService,
    private readonly auth: AuthService,
    private readonly ngZone: NgZone
  ) {
  }

  styleImg(url: string) {
    return this.util.styleImg(url);
  }

  ngOnInit() {
    this.servicios.getAllProxy();
    setTimeout(() => {
      this.loader.preLoadRoute('cards');
      this.loader.preLoadRoute('amigos');
      this.loader.preLoadRoute('perfil');
      this.loader.preLoadRoute('qr');
      this.loader.preLoadRoute('crear-tarjeta');
      this.loader.preLoadRoute('compartir');
    }, 100)
    this.router.initialNavigation();
  }

  tarjetas$ = this.tarjetas.getTarjetas();

  ionViewDidEnter() {
    const preloadArea: HTMLElement = document.getElementById('preload-tarjetas');
    preloadArea.appendChild(document.createElement('ion-chip'));
    preloadArea.appendChild(document.createElement('ion-segment'));
    preloadArea.appendChild(document.createElement('ion-label'));
    preloadArea.appendChild(document.createElement('ion-input'));
    preloadArea.appendChild(document.createElement('ion-back-button'));
  }

  abrirTarjeta(item: Tarjeta) {
    try {

      const data: Persona = {
        ...this.perfil.perfil,
        idtarjetaselected: item.id,
        isChange: true,
      }

      this.ngZone.run(async () => {
        await this.auth.updatePersona(this.perfil.perfil.id, data);

        localStorage.setItem(PERFIL_KEY, JSON.stringify(data));
        this.perfil.setPerfil(data);
      })


      this.router.navigateByUrl(`/tabs/cards/${item.id}`);
    } catch (e) {
      console.log(e);
    }

  }


}
