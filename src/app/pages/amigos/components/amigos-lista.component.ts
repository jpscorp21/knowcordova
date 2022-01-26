import {ChangeDetectionStrategy, Component, EventEmitter, Input, Output} from "@angular/core";
import {UtilService} from "../../../services/shared/util.service";
import {PersonaAmigo} from "../../../interfaces/interface";
import {Observable} from "rxjs";

@Component({
  selector: "app-amigos-lista",
  styleUrls: ['./amigos-lista.component.scss'],
  template: `
    <ion-grid class="d-flex flex-column justify-content-center"
              *ngIf="!(loading$ | async)">
      <ion-row *ngFor="let amigo of amigos | search: (search | async) : 'nombre'">
        <ion-col size="12" class="amigosConfig my-1 d-flex justify-content-start px-2">
          <ion-avatar (click)="mostrarAmigo.emit(amigo)">
            <div class="avatar"
                 *ngIf="amigo.avatar"
                 [style.background]="styleImgWithData(amigo.avatar)">

              <!--<ion-img
                src="https://st.depositphotos.com/1020341/4233/i/600/depositphotos_42333899-stock-photo-portrait-of-huge-beautiful-male.jpg"></ion-img>-->
            </div>
            <div class="avatar-default" *ngIf="!amigo.avatar">
              <img
                [src]="'assets/imagenes/avatarPerfil.svg'"
                alt="avatar-default"
              >
            </div>
          </ion-avatar>
          <ion-card-content style="padding-left: 36px; flex: 1;" (click)="mostrarAmigo.emit(amigo)">
            <ion-label
            >
              <h5
                style="font-size: 16px; font-style: normal; font-weight: bold;">{{amigo.tarjetanombre}}</h5>
              <span>{{amigo.nombre}} {{amigo.apellido}}</span>
            </ion-label>

            <img style="width: 24px; padding-left: 10px;" src="assets/icon/checkBlack.svg"/>

            <br>
            <!--<ion-label style="font-size: 14px; color: #717171 !important;">Miércoles, 1/28</ion-label>-->
            <br>


          </ion-card-content>

          <p class="p-0 mx-0">
            <ion-icon *ngIf="pendiente" slot="icon-only" name="checkmark-circle" style="font-size: 22px; padding-right: 12px;"
                      (click)="aceptarAmigo.emit(amigo)"></ion-icon>
            <ion-icon slot="icon-only" name="trash" style="font-size: 22px"
                      (click)="eliminarAmigo.emit(amigo)"></ion-icon>

          </p>
        </ion-col>
      </ion-row>
    </ion-grid>
  `
})
export class AmigosListaComponent {

  @Input() amigos: PersonaAmigo[] = [];
  @Input() pendiente = false;
  @Input() search: Observable<string>;
  @Input() loading$: Observable<boolean>;
  @Output() mostrarAmigo = new EventEmitter<PersonaAmigo>();
  @Output() eliminarAmigo = new EventEmitter<PersonaAmigo>();
  @Output() aceptarAmigo = new EventEmitter<PersonaAmigo>();

  constructor(
    public util: UtilService,
  ) {
  }

  styleImgWithData(url: string) {
    return this.util.styleImgWithData(url);
  }

}
