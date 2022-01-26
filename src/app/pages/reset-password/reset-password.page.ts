import {AfterViewInit, Component, OnInit} from '@angular/core';
import {AbstractControl, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {BehaviorSubject} from 'rxjs';
import {PersonaLogin} from 'src/app/interfaces/interface';
import {AuthService} from 'src/app/services/auth.service';
import {PerfilService} from 'src/app/services/perfil.service';
import {ToastService} from 'src/app/services/shared/toast.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.page.html',
  styleUrls: ['./reset-password.page.scss'],
})
export class ResetPasswordPage implements OnInit, AfterViewInit {

  public ngForm: FormGroup;
  confirmarClicked = new BehaviorSubject(false);

  constructor(
    public formBuilder: FormBuilder,
    public router: Router,
    public perfil: PerfilService,
    private readonly auth: AuthService,
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

  async registrar() {
    if (!this.ngForm.valid) {
      return;
    }
    try {
      console.log(this.ngForm.value);
      this.confirmarClicked.next(true);

      const dataForSave: PersonaLogin = {
        email: this.perfil.perfil.email,
        password: this.ngForm.value.password,
      }

      const data = await this.auth.resetPassword(dataForSave, this.perfil.perfil.id);
      this.confirmarClicked.next(false);

      if (data && data.dsc) {
        this.confirmarClicked.next(false);
        this.ngForm.reset();

        await this.router.navigateByUrl('/');
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
      password: ['', Validators.required],
      password_confirmation: ['', Validators.required],
    }, {
      validator: this.passwordMatchValidator
    });
  }

  passwordMatchValidator(control: AbstractControl) {
    const password: string = control.get('password').value;
    const confirmPassword: string = control.get('password_confirmation').value;

    if (password !== confirmPassword) {

      control.get('password_confirmation').setErrors({NoPassswordMatch: true});
    }
  }

}


