import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {BehaviorSubject} from 'rxjs';
import {PerfilService} from 'src/app/services/perfil.service';
import {Tarjeta, TarjetaServicio} from '../../interfaces/interface';
import {TarjetasService} from '../../services/tarjetas.service';
import {TarjetaQrModalComponent} from '../../components/tarjeta-qr-modal/tarjeta-qr-modal.component';
import {ModalController} from '@ionic/angular';
import {TarjetaCompartirModalComponent} from '../../components/tarjeta-compartir-modal/tarjeta-compartir-modal.component';
import {ModalPageService} from '../../services/modal-page.service';
import {createConsoleLogServer} from "@ionic/angular-toolkit/builders/cordova-serve/log-server";

@Component({
  selector: 'app-tabs',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './tabs.page.html',
  styleUrls: ['./tabs.page.scss'],
})
export class TabsPage implements OnInit {

  pathSubject = new BehaviorSubject('cards');
  tarjetaSelected = 0;

  urls = {
    perfil: '/assets/icon/profile.svg',
    compartir: '/assets/icon/share-outline.svg',
    amigos: '/assets/icon/meet.svg',
    qr: '/assets/icon/qr.svg'
  };

  constructor(
    private readonly perfil: PerfilService,
    private readonly router: Router,
    private readonly modalPage: ModalPageService,
    private readonly tarjeta: TarjetasService,
    private readonly modal: ModalController,
    private readonly cdr: ChangeDetectorRef
  ) {
  }

  ngOnInit() {
    this.tarjetaSelected = this.perfil.perfil?.idtarjetaselected ?? 0;
  }

  async goTarjetas() {
    if (this.tarjetaSelected) {
      await this.router.navigateByUrl('/tabs/cards/' + this.tarjetaSelected);
    } else {
      await this.router.navigateByUrl('/tabs/cards/0');
    }
  }

  changeTab(ev: { tab: string }) {
    this.pathSubject.next(ev.tab);
  }

  onChangeQr() {
    this.tarjetaSelected = this.perfil.perfil.idtarjetaselected;
    console.log(this.tarjetaSelected)
    if (!this.tarjetaSelected) {
      const tarjeta = Object.values(this.tarjeta.tarjetasByPersona)[0];
      if (tarjeta) {this.mostrarQr(tarjeta);}
    } else {
      if (this.tarjeta.tarjetasByPersona[this.tarjetaSelected]) {
        this.mostrarQr(this.tarjeta.tarjetasByPersona[this.tarjetaSelected]);
      } else {

        const tarjeta = Object.values(this.tarjeta.tarjetasByPersona)[0];
        if (tarjeta) {this.mostrarQr(tarjeta);}
      }

    }
  }


  async mostrarQr(tarjeta: Tarjeta) {
    this.modalPage.setOnModal(true);
    const modal = await this.modal.create({
      component: TarjetaQrModalComponent,
      mode: 'ios',
      componentProps: {
        tarjeta,
        perfil: this.perfil.perfil
      }
    });

    await modal.present();
    await modal.onDidDismiss();
    this.modalPage.setOnModal(false);

    this.cdr.detectChanges();
  }

  onChangeCompartir() {
    this.tarjetaSelected = this.perfil.perfil.idtarjetaselected;
    if (!this.tarjetaSelected || !this.tarjeta.tarjetasByPersona[this.tarjetaSelected]) {
      const tarjeta = Object.values(this.tarjeta.tarjetasByPersona)[0];
      if (tarjeta) {this.mostrarCompartir(tarjeta);}
    } else {
      this.mostrarCompartir(this.tarjeta.tarjetasByPersona[this.tarjetaSelected]);
    }

  }

  async mostrarCompartir(tarjeta: Tarjeta) {
    this.modalPage.setOnModal(true);
    const modal = await this.modal.create({
      component: TarjetaCompartirModalComponent,
      mode: 'ios',
      componentProps: {
        tarjeta,
        perfil: this.perfil.perfil
      }
    });

    await modal.present();
    await modal.onDidDismiss();
    this.modalPage.setOnModal(false);

    this.cdr.detectChanges();
  }
}
