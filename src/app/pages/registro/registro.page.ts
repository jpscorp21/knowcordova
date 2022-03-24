import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { IonInput } from '@ionic/angular';
import { BehaviorSubject } from 'rxjs';
import { PersonaRegistro } from 'src/app/interfaces/interface';
import { AuthService } from 'src/app/services/auth.service';
import { ToastService } from 'src/app/services/shared/toast.service';

@Component({
  selector: 'app-registro',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './registro.page.html',
  styleUrls: ['./registro.page.scss'],
})
export class RegistroPage implements OnInit, AfterViewInit, OnDestroy {

  @ViewChild('usuario') usuarioInput: IonInput;

  public ngForm: FormGroup;

  nextForm = new BehaviorSubject(1);
  confirmarClicked = new BehaviorSubject(false);
  existeCorreo = new BehaviorSubject(false);
  loadingCorreo = new BehaviorSubject(false);
  existeUsuario = new BehaviorSubject(false);

  constructor(
    public formBuilder: FormBuilder,
    public router: Router,
    private readonly auth: AuthService,
    private cdr: ChangeDetectorRef,
    private toast: ToastService,
  ) {
    this.createForm();
  }

  get valid() {
    return this.ngForm.valid;
  }

  ngOnInit() {
    console.log('hola');
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.usuarioInput.setFocus();
    }, 200)
  }

  ionViewDidLeave() {
    // this.ngForm.reset();
  }

  createForm() {
    this.ngForm = this.formBuilder.group({
      email: ['', {
        validators: [Validators.required, Validators.email],
        // asyncValidators: [this.verificarEmail.bind(this)],
      }
      ],
      password: ['', Validators.required],
      password_confirmation:
      [
        '',
        {
          validators: [Validators.required]
        }
      ],
      nombre: ['', Validators.required],
      apellido: ['', Validators.required],
      telefono: [''],
      username: ['', {
        validators: [Validators.required],
        // asyncValidators: [this.verificarUsername.bind(this)],
      }],
      avatar: [''],
    }, {
      validators: [this.passwordMatchValidator()]
    });
  }

  async registrar() {
    if (!this.ngForm.valid) {
      return;
    }

    if (this.loadingCorreo.getValue()) {
      return;
    }


    try {

      this.confirmarClicked.next(true);

      const dataForSave: PersonaRegistro = {
        nombre: this.ngForm.value.nombre,
        apellido: this.ngForm.value.apellido,
        telefono: this.ngForm.value.telefono,
        email: this.ngForm.value.email,
        password: this.ngForm.value.password,
        username: this.ngForm.value.username,
        avatar: this.ngForm.value.avatar,
      }

      const data = await this.auth.verificacionEmail(dataForSave);

      if (data && data.dsc && data.codigo) {
        this.auth.codigo = data.codigo;
        this.confirmarClicked.next(false);
        this.auth.form = {...dataForSave};
        this.router.navigateByUrl('/autenticacion');
      }

      // if (data && data.dsc) {
      //   // this.toast.create(data.dsc);
      //   this.confirmarClicked.next(false);
      //   // localStorage.setItem(PERFIL_KEY, JSON.stringify(data[0]));
      //   // localStorage.setItem('perfil', JSON.stringify(data[0]));
      //   // this.perfil.initPerfil();

      //   this.ngForm.reset();


      //   await this.router.navigateByUrl('/');
      //   this.nextForm.next(1);
      // } else {
      //   await this.toast.create('Error en el registro');
      // }
    }
    catch (e) {
      await this.toast.create('Error en el registro');
      this.confirmarClicked.next(false);
      console.log(e);
    }
  }

  siguiente() {
    this.nextForm.next(2);
    setTimeout(() => {
       (document.querySelector('.nombre input') as HTMLInputElement).focus();
    }, 100)
  }

  submit() {
    console.log('submit');
  }

  async modelChange(event: any) {
    try {

      const username = event.detail.value as string;
      this.existeUsuario.next(false);
      this.loadingCorreo.next(true);

      if (/\s/.test(username)) {
        this.ngForm.controls.username.setErrors({ UserEmpty: true });
        return;
      } else {
        this.ngForm.controls.username.setErrors(null);
      }

      const persona = await this.auth.getByUsername(username).toPromise();
      this.loadingCorreo.next(false);
      if (persona) {
        this.existeUsuario.next(true);
        this.ngForm.controls.username.setErrors({ UserExists: true });
      } else {
        this.ngForm.controls.username.setErrors(null);
      }

      this.cdr.detectChanges();
    } catch(e) {
      this.loadingCorreo.next(false);
      this.existeUsuario.next(false);
      console.log(e);
    }
  }

  async modelChangeEmail(event: any) {
    try {
      const email = event.detail.value as string;
      this.existeCorreo.next(false);
      this.loadingCorreo.next(true);

      const persona = await this.auth.getByEmail(email).toPromise();
      this.loadingCorreo.next(false);
      if (persona) {
        this.existeCorreo.next(true);
        return this.ngForm.controls.email.setErrors({  EmailExists: true  });
      } else {
        return this.ngForm.controls.email.setErrors(null);
      }
    } catch(e) {
      this.loadingCorreo.next(false);
      this.existeCorreo.next(false);
      console.log(e);
    }
  }

  passwordMatchValidator() {
    return (control: AbstractControl) => {
      const password: string = control.get('password').value;
      const confirmPassword: string = control.get('password_confirmation').value;

      if (password !== confirmPassword) {

        control.get('password_confirmation').setErrors({ NoPassswordMatch: true });
      }
    }
  }

  async verificarEmail(control: AbstractControl) {
    try {
      const email = control.value;
      // console.log(email);
      this.existeCorreo.next(false);
      this.loadingCorreo.next(true);

      const persona = await this.auth.getByEmail(email).toPromise();
      this.loadingCorreo.next(false);
      // console.log(persona);
      if (persona) {
        this.existeCorreo.next(true);
        return this.ngForm.controls.email.setErrors({ EmailExists: true });
      } else {
        this.existeCorreo.next(false);
      }
    } catch(e) {
      this.loadingCorreo.next(false);
      this.existeCorreo.next(false);
      console.log(e);
    }
  }

  async verificarUsername(control: AbstractControl) {
    try {
      const username = control.value;
      this.existeUsuario.next(false);
      this.loadingCorreo.next(true);

      const persona = await this.auth.getByUsername(username).toPromise();
      this.loadingCorreo.next(false);
      if (persona) {
        this.existeUsuario.next(true);
        return this.ngForm.controls.username.setErrors({ UserExists: true });
      } else {
        this.existeUsuario.next(false);
      }
    } catch(e) {
      this.loadingCorreo.next(false);
      this.existeUsuario.next(false);
      console.log(e);
    }
  }

  ngOnDestroy() {
    this.ngForm.reset();
  }

}
