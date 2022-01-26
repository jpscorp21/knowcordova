import {Component, Input, OnInit} from '@angular/core';
import {ModalController} from '@ionic/angular';
import {Persona, Tarjeta} from 'src/app/interfaces/interface';
import {UtilService} from 'src/app/services/shared/util.service';

@Component({
  selector: 'app-tarjeta-qr-modal',
  template: `
    <app-know-header-modal [title]="tarjeta.nombretarjeta"></app-know-header-modal>
    <ion-content class="fondo" *ngIf="tarjeta">
      <div *ngIf="perfil">
        <ion-label class="texto">Tu Código Qr</ion-label>
        <div class="qrContent">
          <ngx-qrcode  
            [value]="text"
            [width]=250>
          </ngx-qrcode>
        </div>
      </div>
    </ion-content>
  `,
  styleUrls: ['tarjeta-qr-modal.component.scss']
})

export class TarjetaQrModalComponent implements OnInit {

  @Input() tarjeta: Tarjeta;
  @Input() perfil: Persona;

  text = '';


  constructor(public modal: ModalController, public util: UtilService) {
  }

  ngOnInit() {
    if (this.tarjeta && this.perfil) {
      this.text = `http://knownfc.com/profile/${this.perfil.username}.${this.tarjeta.id}`
    }
  }
}
