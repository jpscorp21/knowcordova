import {ChangeDetectionStrategy, Component, Input, OnInit} from '@angular/core';
import {ModalController} from '@ionic/angular';
import {Persona, PersonaAmigo, PersonaCount, Tarjeta, TarjetaServicio} from 'src/app/interfaces/interface';
import {UtilService} from 'src/app/services/shared/util.service';
import {TarjetasService} from "../../services/tarjetas.service";
import {AuthService} from "../../services/auth.service";
import {of} from "rxjs";
import {UrlService} from "../../services/url.service";

@Component({
  selector: 'app-tarjeta-vercomo-modal',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-know-header-modal></app-know-header-modal>
    <ion-content class="ion-margin-bottom fondo">
      <!--<div *ngIf="perfil">-->
      <div *ngIf="tarjeta$ | async as tarjeta">
        <div *ngIf="perfil$ | async as perfil">
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
        </div>

        <ion-grid *ngIf="perfil$ | async as perfil">
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
        <ion-grid *ngIf="perfil$ | async as perfil">
          <ion-row class="colSeguidores">
            <ion-col style="display: flex; justify-content: center;">
              <ion-label>
                <b>{{perfil.followers}}</b>
                <p>Seguidores</p>
              </ion-label>
            </ion-col>
            <ion-col style="display: flex; justify-content: center;">
              <ion-label>
                <b>{{perfil.following}}</b>
                <p>Siguiendo</p>
              </ion-label>
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
                (click)="abrirUrl(item)"
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
  styleUrls: ['tarjeta-amigo-modal.component.scss']
})

export class TarjetaAmigoModalComponent implements OnInit {

  @Input() amigo: PersonaAmigo;
  @Input() segment: string;
  tarjeta$ = of(null as Tarjeta)
  perfil$ = of(null as Persona)
  friendCount$ = of(null as PersonaCount)

  constructor(
    public modal: ModalController,
    private readonly tarjetaService: TarjetasService,
    private readonly authService: AuthService,
    private urlService: UrlService,
    public util: UtilService) {
  }

  ngOnInit() {
    this.perfil$ = this.authService.getById(this.amigo.idpersona);
    if (this.segment === "following") {
      this.tarjeta$ = this.tarjetaService.getById(this.amigo.idtarjeta);
    }
    // this.friendCount$ = this.authService.frientCount(this.amigo.idpersona);
  }

  styleImg(url: string) {
    return this.util.styleImg(url);
  }

  styleImgDefault(url: string) {
    return this.util.styleImgDefault(url);
  }

  public abrirUrl(item: TarjetaServicio) {
    this.urlService.abrirUrl(item.servicio.prefix, item.valor);
  }
}
