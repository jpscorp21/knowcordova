import {Component, Input, OnInit} from '@angular/core';
import {ModalController} from '@ionic/angular';
import {Persona, Tarjeta} from 'src/app/interfaces/interface';
import {UtilService} from 'src/app/services/shared/util.service';
import {ToastService} from "../../services/shared/toast.service";
import {VCard, VCardEncoding, VCardFormatter} from "ngx-vcard";
// import {Filesystem, Directory, Encoding} from '@capacitor/filesystem';
import * as vcard from 'vcard-creator';


@Component({
  selector: 'app-tarjeta-qr-modal',
  template: `
    <app-know-header-modal [title]="tarjeta.nombretarjeta"></app-know-header-modal>
    <ion-content class="fondo" *ngIf="tarjeta">
      <div *ngIf="perfil">
        <ion-label class="texto">Compartir</ion-label>
        <ion-grid class="redesSociales">
          <ion-row *ngIf="tarjeta">
            <ion-col *ngFor="let item of tarjeta.tarjetaservicioList | share; let i = index" size="4" sizeSm="4"
                     sizeMd="3"
                     sizeLg="2" class="ion-text-center">
              <img
                [src]="item.servicio.logo ? 'data:image/jpeg;base64,' + item.servicio.logo : '/assets/no-imagen.png'"
                width="92px"
                height="92px"
                [alt]="item.servicio.type"
                [style.opacity]="tarjeta.openfirst && i !== 0 ? '0.1' : '1'"
              />
            </ion-col>
          </ion-row>
          <ion-row>
            <ion-col class="ion-padding">
              <ion-button
                class="button-dark"
                [expand]="'block'"
                (click)="compartir()"
              >
                Compartir
              </ion-button>
            </ion-col>
          </ion-row>
        </ion-grid>
      </div>
    </ion-content>
  `,
  styleUrls: ['tarjeta-compartir-modal.component.scss']
})

export class TarjetaCompartirModalComponent implements OnInit {

  @Input() tarjeta: Tarjeta;
  @Input() perfil: Persona;

  text = '';

  public vCard: VCard = {
    name: {
      firstNames: "Jean",
      lastNames: "saucedo",
    },
    version: '3.0',
    telephone: ['0961383301'],
    socialUrls: [] as string[]
  };
  public vCardEncoding: typeof VCardEncoding = VCardEncoding;
  public vCardString = VCardFormatter.getVCardAsString(this.vCard)

  constructor(public modal: ModalController, public util: UtilService, public toast: ToastService) {
  }

  ngOnInit() {
    if (this.tarjeta && this.perfil) {
      this.text = `https://www.know.com.py/${this.perfil.username}.${this.tarjeta.id}`
    }

    this.vCard.name.firstNames = this.perfil?.nombre ?? ''
    this.vCard.name.lastNames = this.perfil?.apellido ?? ''

    if (!this.tarjeta) {
      return;
    }

    if (!this.tarjeta.tarjetaservicioList.length) {
      return;
    }

    if (this.tarjeta.openfirst) {
      if (this.tarjeta.tarjetaservicioList[0]?.servicio.type === 'Number') {
        this.vCard.telephone = [this.tarjeta.tarjetaservicioList[0]?.servicio.valor]
      } else {
        this.vCard.socialUrls[this.tarjeta.tarjetaservicioList[0]?.servicio?.type ?? 'data'] = this.tarjeta.tarjetaservicioList[0]?.servicio?.prefix + this.tarjeta.tarjetaservicioList[0]?.servicio?.valor
      }

      return this.tarjeta;
    }

    this.tarjeta.tarjetaservicioList.forEach((servicio) => {

      if (servicio.servicio.type === 'Number') {
        this.vCard.telephone = [servicio.valor]
      }

      if (servicio.servicio.type) {
        this.vCard.socialUrls[servicio.servicio.type] = servicio.servicio.prefix + servicio.valor
      }
    });
  }

  async compartir() {

    // await this.getPermissions();

    const VCARD = vcard.default;
    const myVcard = new VCARD()

    myVcard
      .addName(this.perfil?.apellido ?? '', this.perfil?.nombre ?? '', '', '', '')

  if (this.tarjeta.openfirst) {
      if (this.tarjeta.tarjetaservicioList[0]?.servicio.type === 'Contactos') {
        myVcard.addPhoneNumber(Number(this.tarjeta.tarjetaservicioList[0]?.servicio.valor))
      } else {
        myVcard.addURL(this.tarjeta.tarjetaservicioList[0]?.servicio?.prefix + this.tarjeta.tarjetaservicioList[0]?.servicio?.valor,
          this.tarjeta.tarjetaservicioList[0]?.servicio?.type ?? 'data')
      }

      return this.exportar(myVcard.toString())
    }

    this.tarjeta.tarjetaservicioList.forEach((servicio) => {
      if (servicio.servicio.type === 'Contactos') {
        myVcard.addPhoneNumber(Number(servicio.valor))
      } else {
        myVcard.addURL(servicio.servicio.prefix + servicio.valor, servicio.servicio?.type ?? 'data')
      }
    });

    return this.exportar(myVcard.toString())
  }

  async exportar(vcard: string) {
    const name = new Date().getTime();

    // TODO - FileSystem

    // const result = await Filesystem.writeFile({
    //   path: `${name}.vcf`,
    //   data: vcard,
    //   directory: Directory.Documents,
    //   encoding: Encoding.UTF8,
    // });

    await this.toast.toastClosed(`El archivo ${name}.vcf fue creado en Documents correctamente`)
  }
}
