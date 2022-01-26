import {Component, Input, OnInit} from '@angular/core';
import {ModalController} from '@ionic/angular';
import {Persona, Tarjeta} from 'src/app/interfaces/interface';
import {UtilService} from 'src/app/services/shared/util.service';

@Component({
  selector: 'app-tarjeta-vercomo-modal',
  template: `
    <app-know-header-modal></app-know-header-modal>
    <ion-content class="ion-margin-bottom fondo" *ngIf="tarjeta">
      <div *ngIf="perfil">
        <div class="container" *ngIf="perfil.avatar" [style.background]="styleImg(perfil.avatar)">
          <div class="avatar">
            <ion-avatar>
              <ion-img
                [src]="perfil.logo ? 'data:image/jpeg;base64,' + perfil.logo : 'assets/imagenes/avatar.png'"></ion-img>
            </ion-avatar>
          </div>
        </div>

        <div class="container" *ngIf="!perfil.avatar && perfil.logo"
             [style.background]="'white'">
          <div class="avatar">
            <ion-avatar>
              <ion-img
                [src]="perfil.logo ? 'data:image/jpeg;base64,' + perfil.logo : 'assets/imagenes/avatar.png'"></ion-img>
            </ion-avatar>
          </div>
        </div>

        <ion-grid>
          <ion-row class="mt-2" *ngIf="!perfil.avatar && !perfil.logo">
            <ion-col size="!2" class="m-auto">
              <img class="text-center" [src]="'/assets/avatar.svg'" alt="Avatar"/>
            </ion-col>
          </ion-row>
          <ion-row class="text-url-container">
            <ion-col size="!2" class="m-auto">
              <span class="text-url">knownfc.com/profile/{{perfil.username}}</span>
            </ion-col>
          </ion-row>
          <ion-row class="text-tarjeta-container" *ngIf="tarjeta">
            <ion-col size="!2" class="m-auto">
              <span class="text-tarjeta">{{tarjeta.nombretarjeta}}</span>
            </ion-col>
          </ion-row>
        </ion-grid>
        <ion-grid style="margin-bottom: 100px" *ngIf="tarjeta && tarjeta.tarjetaservicioList">
          <ion-row class="redesSociales">
            <ion-col
              *ngFor="let item of tarjeta.tarjetaservicioList | orden; let i = index"
              size="6"
              sizeSm="4"
              sizeMd="3"
              sizeLg="2"
              class="ion-text-center colBoxShadow">
              <img
                [src]="item?.servicio?.logo ? 'data:image/jpeg;base64,' + item?.servicio?.logo : '/assets/no-imagen.png'"
                class="img-service"
                alt="No Imagen"
                [style.opacity]="tarjeta.openfirst && i !== 0 ? '0.1' : '1'"
              />
              <ion-label class="tarjeta-subtitle">
                {{item?.servicio?.type}}
              </ion-label>
            </ion-col>
          </ion-row>
        </ion-grid>

      </div>
    </ion-content>
  `,
  styleUrls: ['tarjeta-vercomo-modal.component.scss']
})

export class TarjetaVercomoModalComponent implements OnInit {

  @Input() tarjeta: Tarjeta;
  @Input() perfil: Persona;

  constructor(public modal: ModalController, public util: UtilService) {
  }

  ngOnInit() {
  }

  styleImg(url: string) {
    return this.util.styleImg(url);
  }

  styleImgDefault(url: string) {
    return this.util.styleImgDefault(url);
  }
}
