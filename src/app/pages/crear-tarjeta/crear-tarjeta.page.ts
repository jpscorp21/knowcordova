import {ChangeDetectorRef, Component, NgZone, OnInit} from '@angular/core';
import {FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {AlertController, ModalController} from '@ionic/angular';
import {BehaviorSubject} from 'rxjs';
import {map} from 'rxjs/operators';
import {Servicio, ServicioPost, Tarjeta, TarjetaPost, TarjetaServicio} from 'src/app/interfaces/interface';
import {PerfilService} from 'src/app/services/perfil.service';
import {ServiciosService} from 'src/app/services/servicios.service';
import {ToastService} from 'src/app/services/shared/toast.service';
import {StorageService} from 'src/app/services/storage.service';
import {TarjetasService} from 'src/app/services/tarjetas.service';
import {TarjetaservicioService} from 'src/app/services/tarjetaservicio.service';
import {ServiciosModalComponent} from './servicios-modal/servicios-modal.component';
import {ServicioCrearEdicionModalComponent} from "./servicio-crear-edicion-modal/servicio-crear-edicion-modal.component";

@Component({
  selector: 'app-crear-tarjeta',
  templateUrl: './crear-tarjeta.page.html',
  styleUrls: ['./crear-tarjeta.page.scss'],
})
export class CrearTarjetaPage implements OnInit {

  confirmarClicked = new BehaviorSubject(false);
  activos$ = new BehaviorSubject<{ [key: number]: boolean }>({});
  tarjeta: Tarjeta | null = null;
  public ngForm: FormGroup;

  constructor(
    public formBuilder: FormBuilder,
    public router: Router,
    public route: ActivatedRoute,
    public perfil: PerfilService,
    private toast: ToastService,
    public readonly servicios: ServiciosService,
    private readonly tarjetas: TarjetasService,
    private readonly alert: AlertController,
    private readonly ngZone: NgZone,
    public readonly tarjtasServicios: TarjetaservicioService,
    private readonly modal: ModalController,
    private readonly cdk: ChangeDetectorRef,
    private readonly storage: StorageService
  ) {
    this.createForm();
  }

  servicios$ = this.servicios.servicios$;

  title$ = this.route.params.pipe(map((params) => params.id ? 'Actualizar tarjeta' : 'Crear tarjeta'))

  get id() {
    return this.route.snapshot.params.id;
  }

  get valid() {
    return this.ngForm.valid;
  }

  get servicio_list() {
    return (this.ngForm.controls.servicio_list as FormArray);
  }

  ngOnInit() {
    // if (this.id) {
    //   // setTimeout(() => {

    //   // }, 100);
    //   this.rellenarTarjetaDatos(Number(this.id));
    // }
  }

  ionViewDidEnter() {
    if (this.id) {
      // setTimeout(() => {

      // }, 100);
      this.rellenarTarjetaDatos(Number(this.id));
    }
  }

  ionViewWillLeave() {
    this.cleanData();
  }

  rellenarTarjetaDatos(id: number) {
    this.tarjeta = this.tarjetas.tarjetasByPersona[Number(this.id)];

    if (!this.tarjeta) {
      return;
    }

    const dataForUpdateForm = {
      nombretarjeta: this.tarjeta.nombretarjeta,
      idnfctag: this.tarjeta.nfctag?.id ?? 0,
      servicio_list: this.tarjeta.tarjetaservicioList
    }

    this.ngForm.patchValue(dataForUpdateForm);

    dataForUpdateForm.servicio_list.forEach((servicio) => {
      this.addServicio({...servicio.servicio, valor: servicio.valor});
    })
  }

  createForm() {
    this.ngForm = this.formBuilder.group({
      nombretarjeta: ['', Validators.required],
      servicio_list: this.formBuilder.array([]),
      idnfctag: ['']
    });
  }

  addServicio(servicio: Servicio) {

    const indexToRemove = this.servicio_list.value.findIndex((item: Servicio) => item.id === servicio.id)
    if (indexToRemove > -1) {
      // this.activos$.next({...this.activos$.getValue(), [servicio.id]: false});
      this.servicio_list.removeAt(indexToRemove);
    }

    this.servicio_list.push(
      this.formBuilder.group({
        share: [servicio.share || true],
        type: [servicio.type],
        property: [servicio.property],
        prefix: [servicio.prefix],
        value: [servicio.valor || ''],
        id: [servicio.id],
      })
    )

    this.activos$.next({...this.activos$.getValue(), [servicio.id]: true});
  }

  removeServicio(index: number) {
    const servicio: any = this.servicio_list.controls[index];
    if (!servicio) {
      return;
    }
    this.activos$.next({...this.activos$.getValue(), [servicio.value.id]: false});
    this.servicio_list.removeAt(index);
  }

  async crearTarjeta() {
    if (!this.ngForm.valid) {
      return;
    }

    if (!this.perfil?.perfil?.id) {
      return
    }

    try {
      this.confirmarClicked.next(true);

      if (this.route.snapshot.params.id) {
        return this.actualizarTarjeta(this.ngForm.value);
      }

      const dataForSave: TarjetaPost = {
        idpersona: this.perfil.perfil.id,
        nombretarjeta: this.ngForm.value.nombretarjeta,
        servicio_list: this.mapServicios(this.ngForm.value.servicio_list)
      }

      const data = await this.tarjetas.create(dataForSave);
      this.confirmarClicked.next(false);

      if (data && data.dsc) {
        this.confirmarClicked.next(false);
        // this.toast.create(data.dsc);

        this.ngForm.reset();

        this.servicio_list.clear();

        const tarjetas = await this.tarjetas.getByIdPromise(data.id);

        if (tarjetas) {

          const dataForSave = {
            ...this.tarjetas.tarjetasByPersona,
            [tarjetas.id]: {
              ...tarjetas
            }
          }

          await this.storage.set('tarjetas', dataForSave);
          this.tarjetas.setTarjetasByPersona(dataForSave);
        }


        await this.router.navigateByUrl('/tabs/cards/' + this.perfil.perfil.idtarjetaselected);

      } else {
        await this.toast.create('Error al crear una tarjeta');
      }
    } catch (e) {
      await this.toast.create('Error al crear una tarjeta');
      this.confirmarClicked.next(false);
      console.log(e);
    }
  }

  async actualizarTarjeta(form: any) {
    try {
      this.confirmarClicked.next(true);

      const dataForSave: TarjetaPost = {
        idpersona: this.perfil.perfil.id,
        nombretarjeta: form.nombretarjeta,
        idnfctag: form.idnfctag,
        openfirst: false,
        servicio_list: this.mapServiciosActualizar(this.ngForm.value.servicio_list)
      }


      const data = await this.tarjetas.update(dataForSave, Number(this.route.snapshot.params.id));
      this.confirmarClicked.next(false);

      if (data && data.dsc) {
        this.confirmarClicked.next(false);
        // this.toast.create(data.dsc);

        this.ngForm.reset();

        this.servicio_list.clear();

        // this.tarjetas.resetByPersona();

        const tarjetas = await this.tarjetas.getByIdPromise(Number(this.route.snapshot.params.id));

        if (tarjetas) {

          const dataForSave = {
            ...this.tarjetas.tarjetasByPersona,
            [tarjetas.id]: {
              ...tarjetas
            }
          }

          await this.storage.set('tarjetas', dataForSave);
          this.tarjetas.setTarjetasByPersona(dataForSave);
        }

        // const tarjetaForSave: Tarjeta = {...this.tarjeta, nombretarjeta: dataForSave.nombretarjeta};
        // this.ngZone.run(() => {
        //   this.tarjetas.getByPersonaProxy(this.perfil.perfil.id);
        // })

        await this.router.navigateByUrl('/tabs/cards/' + this.perfil.perfil.idtarjetaselected);
      } else {
        await this.toast.create('Error al actualizar una tarjeta');
      }
    } catch (e) {
      await this.toast.create('Error al actualizar una tarjeta');
      this.confirmarClicked.next(false);
      console.log(e);
    }
  }

  async mostrarServicioModal() {
    const modal = await this.modal.create({
      component: ServiciosModalComponent,
      mode: 'ios'
    })

    await modal.present();

    const {data} = await modal.onDidDismiss<Servicio>();

    if (!data) {
      return;
    }

    this.addServicio({...data});

    this.cdk.detectChanges();
  }

  async addServicioModal(servicio: Servicio) {

    const servicioEncontrado = this.servicio_list.value.find((item: Servicio) => item.id === servicio.id)

    const modal = await this.modal.create({
      component: ServicioCrearEdicionModalComponent,
      componentProps: {
        servicio: {...servicio, value: servicioEncontrado?.value ?? ''},
        canDelete: !!servicioEncontrado
      },
      mode: 'ios'
    })

    await modal.present();

    const {data} = await modal.onWillDismiss<string>();

    if (!data) {
      return;
    }

    if (data === 'delete') {
      const indexToRemove = this.servicio_list.value.findIndex((item: Servicio) => item.id === servicio.id)
      if (indexToRemove > -1) {
        this.removeServicio(indexToRemove);
      }
      return;
    }

    this.addServicio({...servicio, valor: data});

    this.cdk.detectChanges();
  }

  cleanData() {
    this.servicio_list.clear();
    this.activos$.next({});
    this.ngForm.reset();
  }

  private mapServicios(servicio_list: any[]): ServicioPost[] {
    return servicio_list.map((item: Servicio) => ({
      share: true,
      idservicio: item.id,
      valor: item.value
    }));
  }

  private mapServiciosActualizar(servicio_list: any[]): ServicioPost[] {
    return servicio_list.map((item, index) => ({
      share: item.share,
      orden: index + 1,
      idservicio: item.id,
      valor: item.value,
    }));
  }

  private mapServiciosRellenar(servicio_list: TarjetaServicio[]): any[] {
    return servicio_list.map(item => ({
      type: item.servicio.type,
      id: item.servicio.id,
      prefix: item.servicio.prefix,
      property: item.servicio.property,
      valor: item.valor,
      share: item.share
    }));
  }


}
