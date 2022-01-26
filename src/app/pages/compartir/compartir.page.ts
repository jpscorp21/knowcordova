import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import { NFC } from '@awesome-cordova-plugins/nfc/ngx';
import {VCard, VCardEncoding, VCardFormatter} from 'ngx-vcard';
import {combineLatest} from 'rxjs';
import {map} from 'rxjs/operators';
import {PerfilService} from 'src/app/services/perfil.service';
import {TarjetasService} from 'src/app/services/tarjetas.service';
import {TarjetaservicioService} from 'src/app/services/tarjetaservicio.service';
import {OrdenPipe} from "../../pipes/orden.pipe";
import {NfcService} from '../../services/nfc.service';

@Component({
  
  selector: 'app-compartir',
  templateUrl: './compartir.page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./compartir.page.scss'],
})
export class CompartirPage implements OnInit {

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
    public tarjetasServicios: TarjetaservicioService,
    public perfil: PerfilService,
    public tarjeta: TarjetasService,
    public orden: OrdenPipe,
    private nfcService: NfcService,
    private nfcCtrl: NFC
  ) {
  }

  tarjeta$ = combineLatest([
    this.tarjeta.tarjetasByPersona$,
    this.perfil.perfil$
  ])
    .pipe(
      map(([data, perfil]) => {
        const keys = Object.keys(data);

        if (!keys.length) return null;


        const tarjeta = data[perfil.idtarjetaselected || keys[0]];

        this.vCard.name.firstNames = perfil?.nombre ?? ''
        this.vCard.name.lastNames = perfil?.apellido ?? ''

        if (tarjeta.openfirst) {
          if (tarjeta.tarjetaservicioList[0]?.servicio.type === 'Number') {
            this.vCard.telephone = [tarjeta.tarjetaservicioList[0]?.servicio.valor]
          } else {
            this.vCard.socialUrls[tarjeta.tarjetaservicioList[0]?.servicio?.type ?? 'data'] = tarjeta.tarjetaservicioList[0]?.servicio?.prefix + tarjeta.tarjetaservicioList[0]?.servicio?.valor
          }

          return tarjeta;
        }

        tarjeta.tarjetaservicioList.forEach((servicio) => {

          if (servicio.servicio.type === 'Number') {
            this.vCard.telephone = [servicio.valor]
          }

          if (servicio.servicio.type) {
            this.vCard.socialUrls[servicio.servicio.type] = servicio.servicio.prefix + servicio.valor
          }
        });

        return tarjeta;
      })
    )

  ngOnInit() {
  }

  compartir() {

  }

}


