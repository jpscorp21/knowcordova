import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {SelectiveLoadingStrategy} from 'src/app/selective-loading-strategy';
import {AmigosService} from 'src/app/services/amigos.service';
import {AuthService} from 'src/app/services/auth.service';
import {PerfilService} from 'src/app/services/perfil.service';
import {ToastService} from 'src/app/services/shared/toast.service';
import {TarjetasService} from 'src/app/services/tarjetas.service';
import {TarjetaservicioService} from 'src/app/services/tarjetaservicio.service';
import {PERFIL_KEY} from 'src/app/util/constants';
import { Keyboard } from '@awesome-cordova-plugins/keyboard/ngx';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  confirmarClicked = false;
  public ngForm: FormGroup;

  constructor(
    public formBuilder: FormBuilder,
    public router: Router,
    private keyboard: Keyboard,
    public perfil: PerfilService,
    private readonly auth: AuthService,
    private toast: ToastService,
    private tarjetas: TarjetasService,
    private tarjetasServicios: TarjetaservicioService,
    private amigos: AmigosService,
    private loader: SelectiveLoadingStrategy
  ) {
    this.createForm();
  }

  get valid() {
    return this.ngForm.valid;
  }

  ngOnInit() {
    setTimeout(() => {
      this.loader.preLoadRoute('tabs');
    }, 0)

  }

  ionViewDidEnter() {
    localStorage.removeItem(PERFIL_KEY);
    const preloadArea: HTMLElement = document.getElementById('preload-login');
    preloadArea.appendChild(document.createElement('ion-card'));
    preloadArea.appendChild(document.createElement('ion-tab-bar'));
    preloadArea.appendChild(document.createElement('ion-avatar'));
  }

  createForm() {
    this.ngForm = this.formBuilder.group({
      email: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  async iniciarSesion() {
    if (!this.ngForm.valid) {
      return;
    }
    try {
      this.confirmarClicked = true;

      const data: any = await this.auth.login({...this.ngForm.value});
      this.confirmarClicked = false;

      if (data && Array.isArray(data) && data.length) {
        this.tarjetas.resetByPersona();
        this.tarjetasServicios.resetByPersona();
        this.amigos.resetByPersona();
        this.confirmarClicked = false;
        localStorage.setItem(PERFIL_KEY, JSON.stringify(data[0]));
        // localStorage.setItem('perfil', JSON.stringify(data[0]));
        this.perfil.initPerfil();
        this.ngForm.reset();


        await this.router.navigateByUrl('/tabs/cards/0');
      } else {
        await this.toast.create('Dirección de correo electrónico o contraseña no válidos');
      }
    } catch (e) {
      await this.toast.create('Dirección de correo electrónico o contraseña no válidos');
      this.confirmarClicked = false;
      console.log(e);
    }
  }

  hideKeyboard() {
    this.keyboard.hide();
  }

  forgetPassword() {
    this.router.navigateByUrl('/forget-password');
  }
}
