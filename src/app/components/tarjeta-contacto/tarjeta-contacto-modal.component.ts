import {Component, Input, OnInit} from '@angular/core';
import {ModalController} from '@ionic/angular';
import {ServicioPost, Tarjeta, TarjetaPost, TarjetaServicio} from 'src/app/interfaces/interface';
import {UtilService} from 'src/app/services/shared/util.service';
import {BehaviorSubject} from "rxjs";
import {TarjetasService} from "../../services/tarjetas.service";
import {PerfilService} from "../../services/perfil.service";
import {StorageService} from "../../services/storage.service";
import {ToastService} from "../../services/shared/toast.service";

@Component({
  selector: 'app-tarjeta-qr-modal',
  template: `
    <app-know-header-modal></app-know-header-modal>
    <ion-content class="fondo" *ngIf="tarjeta">
      <div class="d-flex justify-content-center fw-bolder" style="font-weight: 900">
        <h3 class="fw-bold">Contacto</h3>
      </div>
      <div class="d-flex justify-content-center fw-bolder text-black-50">
        <p class="my-0">Elige para compartir</p>
      </div>
      <div>
        <ion-row class="redesSociales">
          <ion-col
            *ngFor="let item of servicioList | orden; let i = index"
            size="12"
            class="d-flex align-items-center justify-content-start">
            <img
              [src]="item.servicio.logo ? 'data:image/jpeg;base64,' + item.servicio.logo : '/assets/no-imagen.png'"
              [style.opacity]="tarjeta.openfirst && i !== 0 ? '0.1' : '1'"
              [alt]="item.valor"
              class="img-service-contacto p-2 mx-1"
            />
            <ion-label class="tarjeta-subtitle fw-light pl-3 ion-text-left">
              {{item.servicio.type}}
            </ion-label>
            <div class="flex-grow-1 d-flex justify-content-end px-3">
              <ion-toggle color="dark" [(ngModel)]="item.share"></ion-toggle>
            </div>
          </ion-col>
        </ion-row>
      </div>
    </ion-content>
    <ion-footer class="fondo ion-no-border">
      <ion-toolbar class="fondo w-100">
        <ion-button [disabled]="loading$ | async" expand="block m-2" (click)="updateTarjeta()">Guardar</ion-button>
      </ion-toolbar>
    </ion-footer>
  `,
  styleUrls: ['tarjeta-contacto-modal.component.scss']
})

export class TarjetaContactoModalComponent implements OnInit {

  @Input() tarjeta: Tarjeta;


  servicioList: TarjetaServicio[];
  loadingSubject = new BehaviorSubject(false);
  loading$ = this.loadingSubject.asObservable();
  text = 'Hola';


  constructor(
    public modal: ModalController,
    public util: UtilService,
    private tarjetas: TarjetasService,
    private perfil: PerfilService,
    private storage: StorageService,
    private toast: ToastService
  ) {
  }

  ngOnInit() {
    if (this.tarjeta.tarjetaservicioList) {
      this.servicioList = [...this.tarjeta.tarjetaservicioList];
    }
  }

  async updateTarjeta() {
    this.loadingSubject.next(true);
    try {
      const servicio_list: any[] = TarjetaContactoModalComponent.mapServicios(this.servicioList);

      const dataForSave: TarjetaPost = {
        idpersona: this.perfil.perfil.id,
        nombretarjeta: this.tarjeta.nombretarjeta,
        idnfctag: this.tarjeta.nfctag && this.tarjeta.nfctag.id ? this.tarjeta.nfctag.id : 0,
        openfirst: false,
        servicio_list
      };

      const data = await this.tarjetas.update(dataForSave, this.tarjeta.id);

      if (data && data.dsc) {
        const tarjetas = {
          ...this.tarjetas.tarjetasByPersona,
          [Number(this.tarjeta.id)]: {
            ...this.tarjetas.tarjetasByPersona[Number(this.tarjeta.id)],
            tarjetaservicioList: servicio_list
          }
        };

        await this.storage.set('tarjetas', tarjetas);

        this.loadingSubject.next(false);
        await this.modal.dismiss();

      } else {
        await this.toast.create('Error al actualizar una tarjeta');
      }
    } catch (e: any) {
      this.loadingSubject.next(false);
    }
  }

  private static mapServicios(servicio_list: TarjetaServicio[]): ServicioPost[] {
    return servicio_list.map((item, index) => ({
      ...item,
      share: item.share,
      orden: index + 1,
      idservicio: item.servicio.id,
      valor: item.valor,
    }));
  }
}
