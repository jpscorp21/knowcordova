import {Component, Input, OnInit} from '@angular/core';
import {PopoverController} from '@ionic/angular';
import {NfcService} from '../../services/nfc.service';
import {Tarjeta} from "../../interfaces/interface";

@Component({
  selector: 'app-tarjeta-popover',
  template: `
    <ion-list>
      <ion-item (click)="selectOption('VER_COMO')" lines="none">
        <ion-icon icon="eye" size="small"></ion-icon>
        <ion-label class="px-2">Ver como</ion-label>
      </ion-item>
      <ion-item *ngIf="nfcEnabled && !tarjeta.nfctag" (click)="selectOption('VINCULAR')" lines="none">
        <ion-icon src="assets/icon/sensor.svg" size="small"></ion-icon>
        <ion-label class="px-2">Activar mi know</ion-label>
      </ion-item>
      <ion-item *ngIf="nfcEnabled && tarjeta.nfctag" (click)="selectOption('DESVINCULAR')"
                lines="none">
        <ion-icon icon="ban-outline" size="small"></ion-icon>
        <ion-label class="px-2">Desvincular mi know</ion-label>
      </ion-item>
      <!--<ion-item (click)="selectOption('MOSTRAR_QR')" lines="none">
        <ion-icon icon="qr-code-outline" size="small"></ion-icon>
        <ion-label class="px-2">Mostrar QR</ion-label>
      </ion-item>-->
      <ion-item (click)="selectOption('RENOMBRAR_TARJETA')" lines="none">
        <ion-icon icon="pencil" size="small"></ion-icon>
        <ion-label class="px-2">Renombrar tarjeta</ion-label>
      </ion-item>
      <ion-item (click)="selectOption('ELIMINAR_TARJETA')" lines="none">
        <ion-icon icon="trash" size="small"></ion-icon>
        <ion-label class="px-2">Eliminar tarjeta</ion-label>
      </ion-item>
    </ion-list>
  `
})

export class TarjetaPopoverComponent implements OnInit {

  @Input() tarjeta: Tarjeta;
  nfcEnabled

  constructor(private popover: PopoverController,
              public nfcService: NfcService) {

  }

  async ngOnInit() {
  }

  selectOption(option: string) {
    this.popover.dismiss(option);
  }

  async ionViewWillEnter() {
    this.nfcEnabled = await this.nfcService.nfcEnabled()
  }
}
