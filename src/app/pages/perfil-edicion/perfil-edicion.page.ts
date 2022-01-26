import {AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {IonInput, ModalController} from '@ionic/angular';
import {BehaviorSubject} from 'rxjs';
import {PersonaUpdate} from 'src/app/interfaces/interface';
import {AuthService} from 'src/app/services/auth.service';
import {PerfilService} from 'src/app/services/perfil.service';
import {ToastService} from 'src/app/services/shared/toast.service';
import {PERFIL_KEY} from 'src/app/util/constants';
import {ImagenCropModalComponent} from "./imagen-crop-modal/imagen-crop-modal.component";
import {CameraService} from "../../services/camera.service";

@Component({
  selector: 'app-perfil-edicion',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './perfil-edicion.page.html',
  styleUrls: ['./perfil-edicion.page.scss'],
})
export class PerfilEdicionPage implements OnInit, AfterViewInit {

  @ViewChild('inputAvatar') inputAvatar: IonInput
  @ViewChild('inputLogo') inputLogo: IonInput

  public ngForm: FormGroup;

  nextForm = new BehaviorSubject(1);
  confirmarClicked = new BehaviorSubject(false);

  options: any = {
    logo: {
      targetWidth: 450,
      targetHeight: 450
    },
    avatar: {
      targetWidth: 1080,
      targetHeight: 1080
    }
  }

  imgChangeEvt: any = '';
  cropImgPreview: any = '';

  constructor(
    public formBuilder: FormBuilder,
    public router: Router,
    private readonly auth: AuthService,
    private readonly perfil: PerfilService,
    private readonly modal: ModalController,
    private readonly cameraService: CameraService,
    private readonly cdr: ChangeDetectorRef,
    private toast: ToastService,
  ) {

  }

  get valid() {
    return this.ngForm.valid;
  }

  ngOnInit() {
    if (!this.perfil.perfil || !this.perfil.perfil.id) {
      return this.router.navigateByUrl('/login');
    }

    this.createForm();
  }

  ngAfterViewInit() {
  }


  createForm() {
    this.ngForm = this.formBuilder.group({
      email: [this.perfil.perfil.email, Validators.required],
      nombre: [this.perfil.perfil.nombre, Validators.required],
      apellido: [this.perfil.perfil.apellido],
      telefono: [this.perfil.perfil.telefono],
      avatar: [this.perfil.perfil.avatar],
      logo: [this.perfil.perfil.logo],
    });
  }

  async onFileChange(event: any, key: string) {

    console.log(key)
    const modal = await this.modal.create({
      component: ImagenCropModalComponent,
      mode: 'ios',
      componentProps:
        {
          file: event,
          control: this.ngForm.controls[key],
          label: key
        },
    })

    await modal.present();

    await modal.onDidDismiss();

    (await this.inputAvatar.getInputElement()).value = '';
    (await this.inputLogo.getInputElement()).value = '';


  }

  async onFileBase64Change(base64: any, key: string) {

    const modal = await this.modal.create({
      component: ImagenCropModalComponent,
      mode: 'ios',
      componentProps:
        {
          file: base64,
          control: this.ngForm.controls[key],
          label: key
        },
    })

    await modal.present();

    await modal.onDidDismiss();
  }

  initCropper() {
    // init cropper
  }

  async guardar() {
    if (!this.ngForm.valid) {
      return;
    }

    if (!this.perfil.perfil || !this.perfil.perfil.id) {
      return this.router.navigateByUrl('/login');
    }


    try {
      this.confirmarClicked.next(true);

      const dataForSave: PersonaUpdate = {
        nombre: this.ngForm.value.nombre,
        apellido: this.ngForm.value.apellido,
        email: this.ngForm.value.email,
        username: this.ngForm.value.username,
        avatar: this.ngForm.value?.avatar ?? null,
        logo: this.ngForm.value?.logo ?? null,
      };

      const data = await this.auth.updatePersona(this.perfil.perfil.id, dataForSave);
      this.confirmarClicked.next(false);

      if (data) {
        const newPerfil = {...this.perfil.perfil, ...dataForSave};
        this.confirmarClicked.next(false);
        localStorage.setItem(PERFIL_KEY, JSON.stringify(newPerfil));
        this.perfil.setPerfil(newPerfil);

        await this.router.navigateByUrl('/tabs/cards/' + newPerfil.idtarjetaselected);
      } else {
        await this.toast.create('Error al actualizar el perfil');
      }
    } catch (e) {
      await this.toast.create('Error al actualizar el perfil');
      this.confirmarClicked.next(false);
      console.log(e);
    }
  }

  siguiente() {
    this.nextForm.next(2);
    setTimeout(() => {
      (document.querySelector('.telefono input') as HTMLInputElement).focus();
    }, 100);
  }

  async takePhoto(key: string) {

    const file = await this.cameraService.takePhoto(this.options[key]);

    if (!file) {
      return;
    }

    await this.onFileBase64Change(file, key);

    this.cdr.detectChanges();
  }

  async takeFromAlbum(key: string) {
    const file = await this.cameraService.takeFromAlbum(this.options[key]);

    if (!file) {
      return;
    }

    await this.onFileBase64Change(file, key);

    this.cdr.detectChanges();
  }
}

