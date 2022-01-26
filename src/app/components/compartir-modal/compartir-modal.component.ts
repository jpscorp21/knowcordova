import {Component, Input, OnInit} from '@angular/core';
import {VCard, VCardEncoding, VCardFormatter} from "ngx-vcard";
import {Persona, Tarjeta} from "../../interfaces/interface";
import {ModalController} from "@ionic/angular";
import {Observable, of} from "rxjs";
import {ToastService} from "../../services/shared/toast.service";
import * as vcard from 'vcard-creator';

@Component({
  selector: 'app-compartir-modal',
  templateUrl: './compartir-modal.component.html',
  styleUrls: ['./compartir-modal.component.scss'],
})
export class CompartirModalComponent implements OnInit {

  @Input() tarjeta: Tarjeta;
  @Input() perfil: Persona;
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

  constructor(
    private readonly modal: ModalController,
    private readonly toast: ToastService
  ) {

  }

  ngOnInit() {

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

  async getPermissions(): Promise<void> {
    console.log('button clicked');

  }

  async compartir() {

    await this.getPermissions();

    await this.toast.create('Contacto guardado');
  }


}
