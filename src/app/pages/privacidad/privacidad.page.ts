import {Component, OnInit} from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {Persona, PersonaUpdate} from '../../interfaces/interface';
import {PERFIL_KEY} from '../../util/constants';
import {PerfilService} from '../../services/perfil.service';
import {ToastService} from '../../services/shared/toast.service';
import {AuthService} from '../../services/auth.service';
import {FormControl} from '@angular/forms';

@Component({
  selector: 'app-privacidad',
  templateUrl: './privacidad.page.html',
  styleUrls: ['./privacidad.page.scss'],
})
export class PrivacidadPage implements OnInit {

  confirmarClicked = new BehaviorSubject(false);

  followRequest = new FormControl();
  autofollowaftertapping = new FormControl();

  constructor(private perfil: PerfilService, private toast: ToastService, private auth: AuthService) {
  }

  ngOnInit() {
    this.followRequest.setValue(this.perfil.perfil?.followrequest ?? false);
    this.autofollowaftertapping.setValue(this.perfil.perfil?.autofollowaftertapping ?? false);
  }

  changeFollowRequest() {
    this.guardar({...this.perfil.perfil, followrequest: this.followRequest.value});
  }

  changeAutofollowaftertapping() {
    this.guardar({...this.perfil.perfil, autofollowaftertapping: this.autofollowaftertapping.value});
  }

  async guardar(perfil: Persona) {

    try {
      this.confirmarClicked.next(true);

      const dataForSave: PersonaUpdate = {...perfil};

      delete dataForSave.password;

      const data = await this.auth.updatePersona(perfil.id, dataForSave);
      this.confirmarClicked.next(false);

      if (data) {
        const newPerfil = {...this.perfil.perfil, ...dataForSave};
        this.confirmarClicked.next(false);
        localStorage.setItem(PERFIL_KEY, JSON.stringify(newPerfil));
        this.perfil.setPerfil(newPerfil);

      } else {
        await this.toast.create('Error al actualizar el perfil');
      }
    } catch (e) {
      await this.toast.create('Error al actualizar el perfil');
      this.confirmarClicked.next(false);
      console.log(e);
    }
  }

}
