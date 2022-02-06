/* eslint-disable @typescript-eslint/naming-convention */
import {AfterViewInit, Component, OnInit} from '@angular/core';
import {AbstractControl, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {BehaviorSubject} from 'rxjs';
import {ActivatedRoute, Router} from '@angular/router';
import {PerfilService} from '../../services/perfil.service';
import {AuthService} from '../../services/auth.service';
import {ToastService} from '../../services/shared/toast.service';
import {PersonaLogin} from '../../interfaces/interface';
import {AlertService} from '../../services/shared/alert.service';
import {LoadingController, NavController} from '@ionic/angular';
import {PERFIL_KEY} from '../../util/constants';
import {TarjetasService} from '../../services/tarjetas.service';
import {TarjetaservicioService} from '../../services/tarjetaservicio.service';
import {AmigosService} from '../../services/amigos.service';
import {Location} from '@angular/common';

@Component({
  selector: 'app-forget-password',
  templateUrl: './forget-password.page.html',
  styleUrls: ['./forget-password.page.scss'],
})
export class ForgetPasswordPage implements OnInit, AfterViewInit {

  public ngForm: FormGroup;
  confirmarClicked = new BehaviorSubject(false);
  failedCodigo = new BehaviorSubject(false);

  constructor(
    public formBuilder: FormBuilder,
    public router: Router,
    public perfil: PerfilService,
    public loadingController: LoadingController,
    private readonly auth: AuthService,
    private readonly route: ActivatedRoute,
    private readonly alert: AlertService,
    private readonly location: Location,
    private readonly nav: NavController,
    private tarjetas: TarjetasService,
    private tarjetasServicios: TarjetaservicioService,
    private amigos: AmigosService,
    private toast: ToastService,
  ) {
    this.createForm();
  }

  get valid() {
    return this.ngForm.valid;
  }

  ngOnInit() {
  }

  ngAfterViewInit() {
    // setTimeout(() => {
    //   this.usuarioInput.setFocus();
    // }, 200)
  }

  async aceptar() {

    if (!this.ngForm.valid) {
      return;
    }
    try {
      this.confirmarClicked.next(true);

      const dataForSave: PersonaLogin = {
        email: this.ngForm.value.email,
        password: this.ngForm.value.password,
      };

      const data = await this.auth.forgetPassword(dataForSave);

      //
      if (data && data.dsc) {


        await this.iniciarSesion(dataForSave);

      } else {
        await this.toast.create('Error al cambiar contraseña');
      }
    } catch (e) {
      await this.toast.create('Error al cambiar contraseña');
      this.confirmarClicked.next(false);
      console.log(e);
    }
  }

  async iniciarSesion(user: PersonaLogin) {

    try {
      this.confirmarClicked.next(true);

      const data: any = await this.auth.login({email: user.email, password: user.password});

      this.confirmarClicked.next(false);
      if (data && Array.isArray(data) && data.length) {
        this.tarjetas.resetByPersona();
        this.tarjetasServicios.resetByPersona();
        this.amigos.resetByPersona();

        localStorage.setItem(PERFIL_KEY, JSON.stringify(data[0]));

        this.perfil.initPerfil();
        this.ngForm.reset();
        this.nav.setDirection('root');
        await this.nav.navigateRoot('/tabs/cards/0');
        // await this.router.navigateByUrl('/tabs/cards/0');
        // history.

      } else {
        await this.toast.create('Dirección de correo electrónico o contraseña no válidos');
      }
    } catch (e) {
      await this.toast.create('Dirección de correo electrónico o contraseña no válidos');
      this.confirmarClicked.next(false);
      console.log(e);
    }
  }

  createForm() {
    this.ngForm = this.formBuilder.group({
      email: ['', Validators.email],
      password: ['', Validators.required],
      // eslint-disable-next-line @typescript-eslint/naming-convention
      password_confirmation: ['', Validators.required],
      codigo: [''],
      codigo_verificacion: ['123456']
    }, {
      validator: [this.passwordMatchValidator, this.codigoMatchValidator]
    });
  }

  passwordMatchValidator(control: AbstractControl) {
    const password: string = control.get('password').value;
    const confirmPassword: string = control.get('password_confirmation').value;

    if (password !== confirmPassword) {

      // eslint-disable-next-line @typescript-eslint/naming-convention
      control.get('password_confirmation').setErrors({NoPassswordMatch: true});
    }
  }

  codigoMatchValidator(control: AbstractControl) {
    const codigo: string = control.get('codigo').value;
    const codigo_verificacion: string = control.get('codigo_verificacion').value;

    if (codigo !== codigo_verificacion) {

      // eslint-disable-next-line @typescript-eslint/naming-convention
      control.get('codigo').setErrors({NoCodigoMatch: true});
    }
  }

  async fetchCodigo() {

    const loading = await this.loadingController.create({
      spinner: 'bubbles',
      duration: 5000,
      message: 'Enviando código...',
      translucent: true,
      mode: 'ios',
      cssClass: 'custom-class custom-loading',
      backdropDismiss: true
    });

    await loading.present();

    try {
      if (this.ngForm.value.password !== this.ngForm.value.password_confirmation) {
        return;
      }

      this.failedCodigo.next(false);

      const data = await this.auth.verificacionEmail({email: this.ngForm.value.email});

      await loading.dismiss();

      if (data && data.dsc && data.codigo) {
        this.ngForm.patchValue({codigo_verificacion: data.codigo.toString()});

        await this.alert.alertMessage('Un código se ha enviado a su correo. ');
      }
    } catch(e: any){
      await loading.dismiss();
      await this.alert.alertMessage('Hubo un error. Vuelva a intentarlo ');
      this.failedCodigo.next(true);
    }
  }
}
