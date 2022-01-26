import {Component, OnInit} from '@angular/core';
import {AbstractControl, FormBuilder, FormGroup, Validators} from "@angular/forms";
import {BehaviorSubject} from "rxjs";
import {Router} from "@angular/router";
import {PerfilService} from "../../services/perfil.service";
import {AuthService} from "../../services/auth.service";
import {ToastService} from "../../services/shared/toast.service";
import {PersonaLogin} from "../../interfaces/interface";

@Component({
  selector: 'app-forget-password',
  templateUrl: './forget-password.page.html',
  styleUrls: ['./forget-password.page.scss'],
})
export class ForgetPasswordPage implements OnInit {

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

  async aceptar() {
    if (!this.ngForm.valid) {
      return;
    }
    try {
      this.confirmarClicked.next(true);

      const dataForSave: PersonaLogin = {
        email: this.ngForm.value.email,
        password: this.ngForm.value.password,
      }

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
