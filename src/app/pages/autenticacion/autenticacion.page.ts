import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {Router} from '@angular/router';
import {IonInput} from '@ionic/angular';
import {BehaviorSubject} from 'rxjs';
import {AmigosService} from 'src/app/services/amigos.service';
import {AuthService} from 'src/app/services/auth.service';
import {PerfilService} from 'src/app/services/perfil.service';
import {ToastService} from 'src/app/services/shared/toast.service';
import {TarjetasService} from 'src/app/services/tarjetas.service';
import {TarjetaservicioService} from 'src/app/services/tarjetaservicio.service';
import {PERFIL_KEY} from 'src/app/util/constants';
import {TarjetaPost} from "../../interfaces/interface";
import {StorageService} from "../../services/storage.service";

@Component({
  selector: 'app-autenticacion',
  templateUrl: './autenticacion.page.html',
  styleUrls: ['./autenticacion.page.scss'],
})
export class AutenticacionPage implements OnInit, AfterViewInit {

  @ViewChild('input1') input1: IonInput;
  @ViewChild('input2') input2: IonInput;
  @ViewChild('input3') input3: IonInput;
  @ViewChild('input4') input4: IonInput;
  @ViewChild('input5') input5: IonInput;
  @ViewChild('input6') input6: IonInput;

  confirmarClicked = new BehaviorSubject(false);

  constructor(
    private toast: ToastService,
    public auth: AuthService,
    public router: Router,
    private tarjetas: TarjetasService,
    private tarjetasServicios: TarjetaservicioService,
    private amigos: AmigosService,
    public perfil: PerfilService,
    public storage: StorageService
  ) {
  }

  ngOnInit() {
  }

  getEmail(value: string) {
    return value[0] + "*******" + value.substring(value.indexOf('@'));
  }

  ngAfterViewInit(): void {
    setTimeout(() => this.input1.setFocus(), 0);
  }

  onPasteCode(event: any) {
    console.log(event);
    setTimeout(() => {
      const value = event.target?.value;
      console.log(value);

      // this.input1.value = value[0];
      // this.input2.value = value[1];
      // this.input3.value = value[2];
      // this.input4.value = value[3];
      // this.input5.value = value[4];
      // this.input6.value = value[5];

      this.input6.setFocus();
    }, 300)
  }

  // changeInput(event: any) {
  //   if (event.target.value && event.target.value.length > 1 ) {
  //     event.target.value = event.target.value[0];
  //   }
  // }

  changeFocus(event: any, inputNext: IonInput, inputBack: IonInput): void {
    if (event.keyCode === 17) {
      return;
    }



    if (event.keyCode === 8 && inputBack) {

      setTimeout(() => inputBack.setFocus(), 50);
    } else {

      setTimeout(() => inputNext.setFocus(), 50);
    }
  }

  async handleKeyInput6(event: any, input5: IonInput) {
    if (event.keyCode === 8) {
      this.changeFocus(event, input5, null);
      return;
    }

    if (event.keyCode === 13 || event.KeyCode === 9) {
      return;
    }

    setTimeout(async () => await this.registrar(), 100)


  }

  async registrar() {
    try {

      const codigo = '' + this.input1.value + this.input2.value + this.input3.value + this.input4.value + this.input5.value + this.input6.value;

      if (this.auth.codigo !== Number(codigo)) {
        setTimeout(() => this.input6.value = "", 100);

        await this.toast.create('El código ingresado es incorrecto', {duration: 2000});
        return;
      }

      this.confirmarClicked.next(true);

      const data = await this.auth.register(this.auth.form);

      if (data && data.dsc) {

        const data: any = await this.auth.login({
          email: this.auth.form.email,
          password: this.auth.form.password
        });

        if (data && Array.isArray(data) && data.length) {

          this.tarjetas.resetByPersona();
          this.amigos.resetByPersona();

          const dataForSave: TarjetaPost = {
            idpersona: data[0].id,
            nombretarjeta: 'Tarjeta social',
            servicio_list: []
          }

          const res = await this.tarjetas.create(dataForSave);
          this.confirmarClicked.next(false);

          if (res && res.dsc) {

            const tarjetas = await this.tarjetas.getByIdPromise(res.id);

            const nuevaTarjeta = {
              [res.id]: {
                ...tarjetas
              }
            }

            localStorage.setItem(PERFIL_KEY, JSON.stringify({...data[0], idtarjetaselected: res.id}));
            this.perfil.initPerfil();

            await this.storage.set('tarjetas', nuevaTarjeta);
            this.tarjetas.setTarjetasByPersona(nuevaTarjeta);

            this.auth.codigo = 0;
            this.auth.form = null;

            await this.router.navigateByUrl('/tabs/cards/' + res.id);
          }

        }

      } else {
        await this.toast.create('Error en el registro');
      }
    } catch (e) {
      await this.toast.create('Error en el registro');
      this.confirmarClicked.next(false);
      console.log(e);
    }
  }

}
