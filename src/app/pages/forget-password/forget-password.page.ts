/* eslint-disable @typescript-eslint/naming-convention */
import {AfterViewInit, Component, OnInit} from '@angular/core';
import {AbstractControl, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {BehaviorSubject} from 'rxjs';
import {Router} from '@angular/router';
import {PerfilService} from '../../services/perfil.service';
import {AuthService} from '../../services/auth.service';
import {ToastService} from '../../services/shared/toast.service';
import {PersonaLogin} from '../../interfaces/interface';
import {AlertService} from '../../services/shared/alert.service';

@Component({
  selector: 'app-forget-password',
  templateUrl: './forget-password.page.html',
  styleUrls: ['./forget-password.page.scss'],
})
export class ForgetPasswordPage implements OnInit, AfterViewInit {

  public ngForm: FormGroup;
  confirmarClicked = new BehaviorSubject(false);
  codigo$ = new BehaviorSubject('');

  constructor(
    public formBuilder: FormBuilder,
    public router: Router,
    public perfil: PerfilService,
    private readonly auth: AuthService,
    private readonly alert: AlertService,
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
      this.confirmarClicked.next(false);

      if (data && data.dsc) {
        this.confirmarClicked.next(false);
        this.ngForm.reset();

        await this.router.navigateByUrl('/login');
      } else {
        await this.toast.create('Error al cambiar contraseña');
      }
    } catch (e) {
      await this.toast.create('Error al cambiar contraseña');
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
    if (this.ngForm.value.password !== this.ngForm.value.password_confirmation) {
      return;
    }

    const data = await this.auth.verificacionEmail({email: this.ngForm.value.email});

    if (data && data.dsc && data.codigo) {
      this.ngForm.patchValue({codigo_verificacion: data.codigo.toString()})

      await this.alert.alertMessage('Un código se ha enviado a su correo. ');
    }
  }
}
