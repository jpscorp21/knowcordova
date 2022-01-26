import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { map } from 'rxjs/operators';
import { Servicio } from 'src/app/interfaces/interface';
import { ServiciosService } from 'src/app/services/servicios.service';
import { TarjetasService } from 'src/app/services/tarjetas.service';

@Component({
  selector: 'app-servicios-modal',
  templateUrl: './servicios-modal.component.html',
  styleUrls: ['./servicios-modal.component.scss'],
})
export class ServiciosModalComponent implements OnInit {

  @Input() idTarjeta: number = null;

  constructor(
    public servicios: ServiciosService,
    public tarjeta: TarjetasService,
    public modal: ModalController
  ) { }

  get servicios$() {    
    return this.servicios.servicios$.pipe(
      map((servicios) => servicios.filter(item => !this.tarjeta.tarjetasByPersona[this.idTarjeta].tarjetaservicioList.find(item2 => item2.servicio.id === item.id)))
    );
  }

  ngOnInit() {
    
  }

  addServicio(item: Servicio) {
    this.modal.dismiss(item);
  }

}
