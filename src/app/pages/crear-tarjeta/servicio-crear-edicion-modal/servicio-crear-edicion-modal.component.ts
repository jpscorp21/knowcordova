import {Component, Input, OnInit} from '@angular/core';
import {ModalController} from "@ionic/angular";
import {BehaviorSubject} from "rxjs";
import {Servicio} from "../../../interfaces/interface";
import {FormControl, FormGroup, Validators} from "@angular/forms";

@Component({
  selector: 'app-servicio-crear-edicion-modal',
  templateUrl: './servicio-crear-edicion-modal.component.html',
  styleUrls: ['./servicio-crear-edicion-modal.component.scss'],
})
export class ServicioCrearEdicionModalComponent implements OnInit {

  @Input() servicio: Servicio;
  @Input() canDelete: boolean = false;

  nombre = new FormControl('', {validators: Validators.required})

  constructor(public modal: ModalController) {
  }

  ngOnInit() {
    if (this.servicio) {
      this.nombre.setValue(this.servicio.value);
    }
  }

  abrir() {
    const link = document.createElement('a');
    link.href = this.servicio.prefix + this.nombre.value;
    link.target = "_blank";
    link.click();
  }

  async guardar() {
    await this.modal.dismiss(this.nombre.value);
  }

  async eliminar() {
    await this.modal.dismiss('delete');
  }
}
