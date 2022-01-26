import {AfterViewInit, Component, Input, OnInit, ViewChild} from '@angular/core';
import {FormControl, Validators} from '@angular/forms';
import {IonInput, ModalController} from '@ionic/angular';
import {BehaviorSubject} from 'rxjs';
import {TarjetaServicio, TarjetaServicioPost, TarjetaServicioUpdate} from 'src/app/interfaces/interface';
import {StorageService} from 'src/app/services/storage.service';
import {TarjetasService} from 'src/app/services/tarjetas.service';
import {TarjetaservicioService} from 'src/app/services/tarjetaservicio.service';
import {UrlService} from "../../../services/url.service";

@Component({
  selector: 'app-servicio-edicion-modal',
  template: `
    <ion-header class="ion-no-border">
      <ion-toolbar class="fondo">
        <ion-title mode="ios" class="know-title">Know</ion-title>
        <ion-buttons slot="end">
          <ion-button fill="clear" size="small" (click)="modal.dismiss()">
            <ion-icon name="close" class="text-right"></ion-icon>
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>
    <ion-content class="ion-padding-vertical fondo" *ngIf="tarjetaServicio">
      <ion-grid>
        <ion-row class="ion-margin-bottom">
          <ion-col class="ion-text-center">
            <img
              [src]="tarjetaServicio.servicio.logo ? 'data:image/jpeg;base64,' + tarjetaServicio.servicio.logo : '/assets/no-imagen.png'"
              class="img-service-small"/>
          </ion-col>
        </ion-row>

        <ion-row class="ion-margin-vertical">
          <ion-col class="ion-text-center">
            <span class="edicion-type">{{tarjetaServicio.servicio.type}}</span>
          </ion-col>
        </ion-row>

        <ion-row class="ion-margin-top px-1">
          <ion-col>
            <ion-item class="input fondo">
              <!-- <ion-input [placeholder]="tarjetaServicio.servicio.helper ? 'Ej. ' + tarjetaServicio.servicio.helper : ''" #usuario [formControl]="valorControl"></ion-input>               -->
              <ion-input #usuario [formControl]="valorControl"></ion-input>              
            </ion-item>
            <ion-item lines="none" class="fondo ion-no-padding" style="padding-left: 12px;">
          <ion-note>{{tarjetaServicio.servicio.helper ? 'Ej. ' + tarjetaServicio.servicio.helper : ''}}</ion-note>
        </ion-item>
          </ion-col>
        </ion-row>
        <ion-row class="ion-margin-top px-1">
          <ion-col>
            <ion-button type="submit" class="button-dark" expand="block" (click)="abrir()"
                        [disabled]="(confirmarClicked | async) || !valorControl.valid">Abrir
            </ion-button>
          </ion-col>
          <ion-col>
            <ion-button type="submit" class="button-dark" expand="block" (click)="guardar()"
                        [disabled]="(confirmarClicked | async) || !valorControl.valid">Guardar
            </ion-button>
          </ion-col>
        </ion-row>
      </ion-grid>
    </ion-content>
  `,
  styleUrls: ['./servicio-edicion-modal.component.scss']
})

export class ServicioEdicionModalComponent implements OnInit, AfterViewInit {

  @ViewChild('usuario') usuarioControl: IonInput;
  @Input() tarjetaServicio: TarjetaServicio = null;
  @Input() idTarjeta: number = null;

  valorControl = new FormControl('', Validators.required);

  confirmarClicked = new BehaviorSubject(false);

  constructor(
    public readonly modal: ModalController,
    public readonly tarjetaServicioService: TarjetaservicioService,
    public readonly tarjetas: TarjetasService,
    public readonly storage: StorageService,
    public readonly urlService: UrlService
  ) {
  }

  ngOnInit() {
    this.valorControl.setValue(this.tarjetaServicio.valor);
  }

  ngAfterViewInit() {
    // setTimeout(() => {
    //     this.usuarioControl.setFocus();
    // }, 500);
  }

  abrir() {
    this.urlService.abrirUrl(this.tarjetaServicio.servicio.prefix, this.valorControl.value)
  }

  async guardar() {

    if (!this.valorControl.valid) {
      return
    }

    if (this.tarjetaServicio.id) {
      return this.actualizar();
    }

    try {
      this.confirmarClicked.next(true);


      const dataForSave: TarjetaServicioPost = {
        share: this.tarjetaServicio.share,
        idtarjeta: this.idTarjeta,
        idservicio: this.tarjetaServicio.servicio.id,
        valor: this.valorControl.value,
        orden: this.tarjetaServicio.orden
      }

      const data = await this.tarjetaServicioService.post(dataForSave);


      this.confirmarClicked.next(false);
      if (data && data.dsc) {
        // this.toast.create(data.dsc, {duration: 1000});

        // this.tarjetasServicio.resetByPersona();
        const tarjetas = {
          ...this.tarjetas.tarjetasByPersona,
          [this.idTarjeta]: {
            ...this.tarjetas.tarjetasByPersona[this.idTarjeta],
            tarjetaservicioList: [...this.tarjetas.tarjetasByPersona[this.idTarjeta].tarjetaservicioList, {
              ...this.tarjetaServicio,
              id: data.id,
              valor: dataForSave.valor
            }]
          }
        }

        await this.modal.dismiss();

        await this.storage.set('tarjetas', tarjetas);
        this.tarjetas.setTarjetasByPersona(tarjetas);

      } else {
        this.confirmarClicked.next(false);
        console.log(data);
      }
    } catch (e) {
      this.confirmarClicked.next(false);
      console.log(e);
    }
  }

  async actualizar() {

    if (!this.valorControl.valid) {
      return
    }

    try {
      this.confirmarClicked.next(true);


      const dataForSave: TarjetaServicioUpdate = {
        share: this.tarjetaServicio.share,
        orden: this.tarjetaServicio.orden,
        valor: this.valorControl.value,
        idtarjeta: this.idTarjeta,
        idservicio: this.tarjetaServicio.servicio.id,
      }

      const data = await this.tarjetaServicioService.update(dataForSave, this.tarjetaServicio.id);


      this.confirmarClicked.next(false);
      if (data && data.dsc) {
        // this.toast.create(data.dsc, {duration: 1000});

        // this.tarjetasServicio.resetByPersona();
        const tarjetas = {
          ...this.tarjetas.tarjetasByPersona,
          [this.idTarjeta]: {
            ...this.tarjetas.tarjetasByPersona[this.idTarjeta],
            tarjetaservicioList: this.tarjetas.tarjetasByPersona[this.idTarjeta].tarjetaservicioList.map((tar) => {
              if (tar.id === this.tarjetaServicio.id) {
                return {
                  ...tar,
                  valor: dataForSave.valor
                }
              }

              return tar;
            })
          }
        }

        await this.modal.dismiss();

        await this.storage.set('tarjetas', tarjetas);
        this.tarjetas.setTarjetasByPersona(tarjetas);

      } else {
        this.confirmarClicked.next(false);
        console.log(data);
      }
    } catch (e) {
      this.confirmarClicked.next(false);
      console.log(e);
    }
  }

}
