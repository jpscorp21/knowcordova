import {Component, Input, OnInit} from '@angular/core';
import {Persona, Tarjeta, TarjetaPost} from "../../interfaces/interface";
import {FormControl, Validators} from "@angular/forms";
import {BehaviorSubject} from "rxjs";
import {ModalController} from "@ionic/angular";
import {TarjetasService} from "../../services/tarjetas.service";
import {StorageService} from "../../services/storage.service";

@Component({
  selector: 'app-tarjeta-renombrar',
  templateUrl: './tarjeta-renombrar.component.html',
  styleUrls: ['./tarjeta-renombrar.component.scss'],
})
export class TarjetaRenombrarComponent implements OnInit {

  @Input() tarjeta: Tarjeta;
  @Input() perfil: Persona;

  confirmarClicked = new BehaviorSubject(false);

  nombre = new FormControl('', {validators: Validators.required})

  constructor(
    public modal: ModalController,
    public tarjetas: TarjetasService,
    public storage: StorageService
  ) {
  }

  ngOnInit() {
    if (this.tarjeta) {
      this.nombre.setValue(this.tarjeta.nombretarjeta);
    }
  }

  async guardar() {
    if (!this.nombre.valid) {
      return;
    }

    try {
      this.confirmarClicked.next(true);

      const dataForSave: TarjetaPost = {
        idpersona: this.perfil.id,
        nombretarjeta: this.nombre.value,
        idnfctag: this.tarjeta?.nfctag?.id ?? 0,
        openfirst: this.tarjeta.openfirst,
      }

      const data = await this.tarjetas.update(dataForSave, this.tarjeta.id);
      this.confirmarClicked.next(false);

      if (data && data.dsc) {
        const tarjetas = {
          ...this.tarjetas.tarjetasByPersona,
          [Number(this.tarjeta.id)]: {
            ...this.tarjetas.tarjetasByPersona[Number(this.tarjeta.id)],
            nombretarjeta: dataForSave.nombretarjeta
          }
        }

        await this.storage.set('tarjetas', tarjetas);
        this.tarjetas.setTarjetasByPersona(tarjetas);
        await this.modal.dismiss();
      }
    } catch (e: any) {
      console.log(e);
      this.confirmarClicked.next(false);
    }
  }
}
