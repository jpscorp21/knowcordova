import {ChangeDetectionStrategy, Component, Input, OnInit} from '@angular/core';
import {AlertController, ModalController} from '@ionic/angular';
import {Persona, PersonaAmigo, PersonaCount, Tarjeta, TarjetaServicio} from 'src/app/interfaces/interface';
import {UtilService} from 'src/app/services/shared/util.service';
import {TarjetasService} from "../../services/tarjetas.service";
import {AuthService} from "../../services/auth.service";
import {BehaviorSubject, forkJoin, of} from "rxjs";
import {UrlService} from "../../services/url.service";
import {tap} from "rxjs/operators";
import {AmigosService} from "../../services/amigos.service";
import {AlertService} from "../../services/shared/alert.service";
import {PerfilService} from "../../services/perfil.service";
import {ToastService} from "../../services/shared/toast.service";
import {AlertOptions} from "@ionic/core";
import { Router } from '@angular/router';

@Component({
  selector: 'app-tarjeta-vercomo-modal',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-know-header-modal></app-know-header-modal>

    <ion-content class="ion-margin-bottom fondo">
      <!--<div *ngIf="perfil">-->
      <jp-cargando *ngIf="(loading$ | async)"></jp-cargando>
      <div *ngIf="dataJoin | async as data">
        <div>
          <div class="container" *ngIf="data[0].avatar" [style.background]="styleImg(data[0].avatar)">
            <div class="avatar">
              <ion-avatar>
                <ion-img
                  [src]="data[0].logo ? 'data:image/jpeg;base64,' + data[0].logo : 'assets/imagenes/avatar.png'"></ion-img>
              </ion-avatar>
            </div>
          </div>

          <div class="container" *ngIf="!data[0].avatar && data[0].logo"
               [style.background]="'white'">
            <div class="avatar">
              <ion-avatar>
                <ion-img
                  [src]="data[0].logo ? 'data:image/jpeg;base64,' + data[0].logo : 'assets/imagenes/avatar.png'"></ion-img>
              </ion-avatar>
            </div>
          </div>
        </div>

        <ion-grid>
          <ion-row class="mt-2" *ngIf="!data[0].avatar && !data[0].logo">
            <ion-col size="!2" class="m-auto">
              <img class="text-center" [src]="'/assets/avatar.svg'" alt="Avatar"/>
            </ion-col>
          </ion-row>
          <ion-row class="text-tarjeta-container">
            <ion-col size="!2" class="m-auto">
              <span class="text-tarjeta">{{data[0]?.nombre ?? ''}} {{data[0]?.apellido ?? ''}}</span>
            </ion-col>
          </ion-row>
          <ion-row class="text-url-container">
            <ion-col size="!2" class="m-auto">
              <span class="text-url">knownfc.com/profile/{{data[0].username}}.{{data[1].id}}</span>
            </ion-col>
          </ion-row>
          <ion-row class="text-tarjeta-container" *ngIf="data[1]">
            <ion-col size="!2" class="m-auto">
              <span class="text-tarjeta">{{data[1].nombretarjeta}}</span>
            </ion-col>
          </ion-row>
        </ion-grid>
        <ion-grid>
          <ion-row class="colSeguidores">
            <ion-col style="display: flex; justify-content: center;">
              <ion-label>
                <b>{{data[0].followers}}</b>
                <p>Seguidores</p>
              </ion-label>
            </ion-col>
            <ion-col style="display: flex; justify-content: center;">
              <ion-label>
                <b>{{data[0].following}}</b>
                <p>Siguiendo</p>
              </ion-label>
            </ion-col>
          </ion-row>
          <ion-row *ngIf="!(seguido$ | async)">
            <ion-col style="text-align: center;" class="ion-padding-top ion-padding-horizontal px-5">
              <ion-button mode="ios" class="button-dark" expand="block" (click)="conectar(data[0], data[1])"
                          [disabled]="loadingFriendSubject | async">
                Seguir
              </ion-button>
            </ion-col>
          </ion-row>
          <ion-row *ngIf="seguido$ | async as seguido">
            <ion-col style="text-align: center;" class="ion-padding-top ion-padding-horizontal px-5">
              <ion-button mode="ios" class="button-dark white" expand="block" (click)="desconectar(seguido)"
                          [disabled]="loadingFriendSubject | async">
                Seguido
              </ion-button>
            </ion-col>
          </ion-row>
        </ion-grid>
        <ion-grid style="margin-bottom: 100px" *ngIf="data[1] && data[1].tarjetaservicioList">
          <ion-row class="redesSociales">
            <ion-col
              *ngFor="let item of data[1].tarjetaservicioList | orden; let i = index"
              size="6"
              sizeSm="4"
              class="ion-text-center colBoxShadow">
              <img
                [src]="item?.servicio?.logo ? 'data:image/jpeg;base64,' + item?.servicio?.logo : '/assets/no-imagen.png'"
                class="img-service"
                alt="No Imagen"
                (click)="abrirUrl(item)"
                [style.opacity]="data[1].openfirst && i !== 0 ? '0.1' : '1'"
              />
              <ion-label class="tarjeta-subtitle">
                {{item?.servicio?.type}}
              </ion-label>
            </ion-col>
          </ion-row>
        </ion-grid>
      </div>
      <!--<ion-fab vertical="bottom" horizontal="end" slot="fixed" class="m-2"
               *ngIf="!(loading$ | async) && dataJoin | async as data">
        <ion-fab-button [disabled]="(loadingFriend$ | async)" (click)="conectar(data[0], data[1])">
          <ion-icon name="add"></ion-icon>
        </ion-fab-button>
      </ion-fab>-->
    </ion-content>
  `,
  styleUrls: ['tarjeta-amigo-conectar-modal.component.scss']
})

export class TarjetaAmigoConectarModalComponent implements OnInit {

  @Input() usuario: string;
  @Input() idtarjeta: number;
  tarjeta$ = of(null as Tarjeta)
  perfil$ = of(null as Persona)
  friendCount$ = of(null as PersonaCount)
  loadingSubject = new BehaviorSubject(true);
  loading$ = this.loadingSubject.asObservable()

  loadingFriendSubject = new BehaviorSubject(false);
  loadingFriend$ = this.loadingFriendSubject.asObservable();

  seguidoSubject = new BehaviorSubject(null as PersonaAmigo);
  seguido$ = this.seguidoSubject.asObservable();

  dataJoin = of(null as [Persona, Tarjeta])

  constructor(
    public modal: ModalController,
    private readonly tarjetaService: TarjetasService,
    private readonly authService: AuthService,
    private readonly amigos: AmigosService,
    private readonly perfil: PerfilService,
    private readonly toast: ToastService,
    private readonly alertCtrl: AlertController,
    private urlService: UrlService,
    private router: Router,
    private alert: AlertService,
    public util: UtilService) {
  }

  async ngOnInit() {
    try {
      this.dataJoin = forkJoin([this.authService.getByUsername(this.usuario), this.tarjetaService.getById(this.idtarjeta)]).pipe(
        tap(() => {
          this.loadingSubject.next(false)
        })
      );
      /*this.perfil$ = this.authService.getByUsername(this.usuario);
      this.tarjeta$ = this.tarjetaService.getById(this.idtarjeta).pipe(
        tap(() => {
          this.loadingSubject.next(false)
        })
      );*/

      const response = await this.amigos.getByPersonaFollowingCards(this.perfil?.perfil?.id).toPromise();
      const existePersona = response.following.find((item) => item.idtarjeta === this.idtarjeta);

      if (existePersona) {
        this.seguidoSubject.next(existePersona)
      }

    } catch (e: any) {
      this.loadingSubject.next(false)
    }

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

  async conectar(amigo: Persona, tarjeta: Tarjeta) {

    if (!this.perfil.perfil) {  
      this.modal.dismiss();
      this.router.navigateByUrl('/login')
      return;
    }


    if (!(await this.alert.alertOk('¿Estás seguro de seguir a ' + amigo.nombre + ' ' + amigo.apellido + '?'))) {
      return;
    }

    if (!amigo) {
      return;
    }

    this.loadingFriendSubject.next(true)

    const response = await this.amigos.getByPersonaFollowingCards(this.perfil?.perfil.id).toPromise();
    const existePersona = response.following.find((item) => item.idtarjeta === tarjeta.id);

    if (existePersona) {
      this.loadingFriendSubject.next(false)
      return await this.toast.create(`Ya añadiste a ${amigo.nombre} ${amigo.apellido}`);
    }

    try {
      await this.amigos.postFriend({        
        idtarjeta: tarjeta.id,
        idpersona: this.perfil?.perfil?.id ?? 0        
      })

      await this.toast.create(`${amigo.nombre} ${amigo.apellido} añadido correctamente`)

      const responseNuevo = await this.amigos.getByPersonaFollowingCards(this.perfil?.perfil.id).toPromise();
      const nuevaPersona = responseNuevo.following.find((item) => item.idtarjeta === tarjeta.id);

      if (nuevaPersona) {
        this.seguidoSubject.next(nuevaPersona)
      }

      this.loadingFriendSubject.next(false)
    } catch (e: any) {
      console.log(e);
      this.loadingFriendSubject.next(false)
    }
  }

  async desconectar(seguido: PersonaAmigo) {

    if (!this.perfil.perfil) {  
      this.modal.dismiss();
      this.router.navigateByUrl('/login')
      return;
    }

    if (!(await this.alertOk('¿Quieres dejar de seguir a ' + seguido.nombre + '?'))) {
      return;
    }

    try {
      await this.amigos.remove(seguido.idfriend, 'following')
      this.seguidoSubject.next(null);
      this.loadingFriendSubject.next(false)
    } catch (e: any) {
      console.log(e);
      this.loadingFriendSubject.next(false)
    }
  }

  async alertOk(message: string, options: AlertOptions = {}) {
    const alert = await this.alertCtrl.create({
      header: options.header || 'Mensaje del Sistema',
      message,
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          handler: () => false
        },
        {
          text: 'Dejar de seguir',
          role: 'aceptar',
          handler: () => true
        },

      ]
    });

    await alert.present();

    const {role} = await alert.onDidDismiss();

    return role !== 'cancel' && role !== 'backdrop';
  }

}
