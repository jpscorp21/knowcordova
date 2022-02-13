import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, NgZone, OnDestroy, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalController, Platform, PopoverController } from '@ionic/angular';
import { BehaviorSubject, combineLatest, Observable, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { Servicio, ServicioPost, Tarjeta, TarjetaPost, TarjetaServicio } from 'src/app/interfaces/interface';
import { ServicioEdicionModalComponent } from 'src/app/pages/crear-tarjeta/servicio-edicion-modal/servicio-edicion-modal.component';
import { ServiciosModalComponent } from 'src/app/pages/crear-tarjeta/servicios-modal/servicios-modal.component';
import { PerfilService } from 'src/app/services/perfil.service';
import { ToastService } from 'src/app/services/shared/toast.service';
import { UtilService } from 'src/app/services/shared/util.service';
import { StorageService } from 'src/app/services/storage.service';
import { TarjetasService } from 'src/app/services/tarjetas.service';
import { TarjetaservicioService } from 'src/app/services/tarjetaservicio.service';
import { ServiciosService } from '../../services/servicios.service';
import { TarjetaPopoverComponent } from '../tarjeta-popover/tarjeta-popover.component';
import { TarjetaVercomoModalComponent } from '../tarjeta-vercomo-modal/tarjeta-vercomo-modal.component';
import { TarjetaRenombrarComponent } from "../tarjeta-renombrar/tarjeta-renombrar.component";
import { AlertService } from "../../services/shared/alert.service";
import { CompartirModalComponent } from "../compartir-modal/compartir-modal.component";
import { TagsService } from 'src/app/services/tags.service';
import { TarjetaQrModalComponent } from "../tarjeta-qr-modal/tarjeta-qr-modal.component";
import { TarjetaContactoModalComponent } from "../tarjeta-contacto/tarjeta-contacto-modal.component";
import { NfcService } from 'src/app/services/nfc.service';
import { Ndef, NFC } from '@awesome-cordova-plugins/nfc/ngx';
import { BackgroundMode } from '@awesome-cordova-plugins/background-mode/ngx';
import {ModalPageService} from "../../services/modal-page.service";

@Component({
  selector: 'app-tarjetas',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './tarjetas.component.html',
  styleUrls: ['./tarjetas.component.scss'],
})
export class TarjetasComponent implements OnInit, OnDestroy {

  @Input() idTarjeta: number;
  @Input() isDrag: BehaviorSubject<boolean>;

  // public compartirTodo;
  public abrirPrimero;

  textoAbrir = new BehaviorSubject('Abrir todos');
  tarjetaservicioId = new BehaviorSubject<number>(-1);
  subscriptions: Array<Subscription> = new Array<Subscription>();
  isUpdate = new BehaviorSubject(false);
  segmentValue = 'abrirPrimero';
  tarjeta$: Observable<Tarjeta> = null;
  plataforma;
  subscriptionExit = new Subscription();

  constructor(
    public readonly servicio: ServiciosService,
    public readonly tarjetasServicio: TarjetaservicioService,
    public readonly tarjetas: TarjetasService,
    private readonly modalPage: ModalPageService,
    public readonly perfil: PerfilService,
    public readonly route: ActivatedRoute,
    public readonly sanitizer: DomSanitizer,
    public readonly toast: ToastService,
    public readonly ngZone: NgZone,
    public readonly cdr: ChangeDetectorRef,
    public util: UtilService,
    public alert: AlertService,
    public readonly router: Router,
    private readonly storage: StorageService,
    private readonly modal: ModalController,
    private readonly popover: PopoverController,
    private nfcService: NfcService,
    private nfcCtrl: NFC,
    private ndef: Ndef,
    private tagService: TagsService,
    private platform: Platform,

  ) {
  }

  styleImg(url: string) {
    return this.util.styleImg(url);
  }

  styleImgDefault(url: string) {
    return this.util.styleImgDefault(url);
  }

  ngOnInit() {
    this.tarjeta$ = combineLatest([this.tarjetas.getTarjeta(this.idTarjeta), this.isUpdate])
      .pipe(
        map(([tarjeta, isUpdate]) => {
          if (isUpdate) {
            this.actualizarTarjeta(tarjeta);
          }
          return tarjeta;
        })
      );
    if (this.platform.is('android')) {
      this.plataforma = 'android'
    } else if (this.platform.is('ios')) {
      this.plataforma = 'ios'
    }
  }

  get id() {
    return this.idTarjeta;
  }

  get loading() {
    return this.tarjetasServicio.loadingByPersona;
  }

  options = {
    delay: 500,
    onStart: (event) => {
      console.log(event);
      event.preventDefault();
      event.stopPropagation();
      this.isDrag.next(true);
      console.log('hola');
    },
    onEnd: () => {
      this.isDrag.next(false);
    },
    onUpdate: () => this.isUpdate.next(true)
  };


  changeSegment(ev: any) {
    console.log(ev.detail.value);
    this.segmentValue = '';
  }

  async moreOptions(ev: any, tarjeta: Tarjeta) {
    const popover = await this.popover.create({
      component: TarjetaPopoverComponent,
      componentProps: {
        tarjeta
      },
      cssClass: 'custom',
      event: ev,
      translucent: true
    });
    await popover.present();

    const { data } = await popover.onWillDismiss();

    if (!data) {
      return;
    }

    switch (data) {
      case 'VER_COMO':
        return this.showMostrarVerComo(tarjeta);
      case 'RENOMBRAR_TARJETA':
        return this.showMostrarRenombrarTarjeta(tarjeta);
      case 'ELIMINAR_TARJETA':
        return this.eliminarTarjeta(tarjeta);
      case 'COMPARTIR':
        return this.compartirModal(tarjeta);
      case 'VINCULAR':
        return this.vincularTag(tarjeta, `http://knownfc.com/profile/${this.perfil.perfil.username}.${tarjeta.id}`);
      case 'DESVINCULAR':
        return this.desvincularTarjeta(tarjeta);
      case 'MOSTRAR_QR':
        return this.mostrarQr(tarjeta);
      default:
        return;
    }
  }

  async showMostrarVerComo(tarjeta: Tarjeta) {

    this.modalPage.setOnModal(true);

    const modal = await this.modal.create({
      component: TarjetaVercomoModalComponent,
      mode: 'ios',
      componentProps: {
        tarjeta,
        perfil: this.perfil.perfil
      }
    });

    await modal.present();
    await modal.onDidDismiss();
    this.modalPage.setOnModal(false);
  }

  async showMostrarRenombrarTarjeta(tarjeta: Tarjeta) {
    this.modalPage.setOnModal(true);
    const modal = await this.modal.create({
      component: TarjetaRenombrarComponent,
      mode: 'ios',
      componentProps: {
        tarjeta,
        perfil: this.perfil.perfil
      }
    });

    await modal.present();
    await modal.onDidDismiss();
    this.modalPage.setOnModal(false);
  }

  async eliminarTarjeta(tarjeta: Tarjeta) {

    if (!(await this.alert.alertOk('Estás seguro de eliminar la tarjeta'))) {
      return;
    }

    try {
      await this.tarjetas.remove(tarjeta.id);

      const dataForUpdate = { ...this.tarjetas.tarjetasByPersona };
      delete dataForUpdate[tarjeta.id];

      await this.storage.set('tarjetas', dataForUpdate);
      this.tarjetas.setTarjetasByPersona(dataForUpdate);
      await this.modal.dismiss();

    } catch (e) {
      console.log(e);
    }
  }

  async abrir() {
    try {

      if (!this.tarjetas.tarjetasByPersona[this.id] || !this.tarjetas.tarjetasByPersona[this.id].tarjetaservicioList.length) {
        return;
      }

      const tarjeta = this.tarjetas.tarjetasByPersona[this.id];

      if (!tarjeta.openfirst) {
        await this.updateTarjetaForFirst(tarjeta, true);
        this.textoAbrir.next('Abrir primero');
      } else {
        await this.updateTarjetaForFirst(tarjeta, false);
        this.textoAbrir.next('Abrir todos');
      }
    } catch (e) {
      console.log(e);
    }
  }

  async updateTarjetaForFirst(tarjeta: Tarjeta, openfirst: boolean) {
    await this.tarjetas.update({
      ...tarjeta,
      idnfctag: tarjeta.nfctag ? tarjeta.nfctag.id : '0',
      openfirst
    }, this.id);

    const tarjetas = {
      ...this.tarjetas.tarjetasByPersona,
      [tarjeta.id]: {
        ...this.tarjetas.tarjetasByPersona[tarjeta.id],
        openfirst
      }
    };

    await this.storage.set('tarjetas', tarjetas);
    this.tarjetas.setTarjetasByPersona(tarjetas);

  }

  async mostrarServicioModal() {
    this.modalPage.setOnModal(true);
    const modal = await this.modal.create({
      component: ServiciosModalComponent,
      mode: 'ios',
      cssClass: 'servicios',
      componentProps: {
        idTarjeta: this.idTarjeta
      }
    });

    modal.present();


    const { data } = await modal.onDidDismiss<Servicio>();

    this.modalPage.setOnModal(false);

    if (!data) {
      return;
    }

    this.mostrarServicioEdicion({
      valor: '',
      share: true,
      orden: Object.keys(this.tarjetas.tarjetasByPersona).length + 1,
      id: null,
      servicio: { ...data }
    });
    //this.addServicio({...data});

    this.cdr.detectChanges();
  }

  async mostrarServicioEdicion(tarjetaServicio: TarjetaServicio) {
    this.modalPage.setOnModal(true)
    const modal = await this.modal.create({
      component: ServicioEdicionModalComponent,
      mode: 'ios',
      cssClass: 'servicios-edicion',
      componentProps: {
        tarjetaServicio,
        idTarjeta: this.idTarjeta
      }

    });

    await modal.present();
    await modal.onDidDismiss()
    this.modalPage.setOnModal(false);

    this.cdr.detectChanges();
  }

  async mostrarCompartirContacto(tarjeta: Tarjeta) {
    this.modalPage.setOnModal(true)
    const modal = await this.modal.create({
      component: TarjetaContactoModalComponent,
      mode: 'ios',
      componentProps: {
        tarjeta
      }
    });

    await modal.present();

    await modal.onDidDismiss()
    this.modalPage.setOnModal(false)

    this.cdr.detectChanges();
  }

  async compartirModal(tarjeta: Tarjeta) {
    this.modalPage.setOnModal(true)
    const modal = await this.modal.create({
      component: CompartirModalComponent,
      mode: 'ios',
      componentProps: {
        tarjeta,
        perfil: this.perfil.perfil
      }
    });

    await modal.present();

    await modal.onDidDismiss()
    this.modalPage.setOnModal(false)

    this.cdr.detectChanges();
  }

  async mostrarQr(tarjeta: Tarjeta) {
    this.modalPage.setOnModal(true)
    const modal = await this.modal.create({
      component: TarjetaQrModalComponent,
      mode: 'ios',
      componentProps: {
        tarjeta,
        perfil: this.perfil.perfil
      }
    });

    await modal.present();
    await modal.onDidDismiss()
    this.modalPage.setOnModal(false)

    this.cdr.detectChanges();
  }

  public editarTarjeta() {
    this.mostrarServicioModal();
  }

  public editarTarjetaInCrear() {
    this.router.navigateByUrl('/tabs/crear-tarjeta/' + this.idTarjeta);
  }

  async actualizarTarjeta(tarjeta: Tarjeta) {

    if (!this.perfil?.perfil?.id) {
      return;
    }

    try {

      // eslint-disable-next-line @typescript-eslint/naming-convention
      const servicio_list: any[] = TarjetasComponent.mapServicios(tarjeta.tarjetaservicioList);

      const dataForSave: TarjetaPost = {
        idpersona: this.perfil.perfil.id,
        nombretarjeta: tarjeta.nombretarjeta,
        idnfctag: tarjeta.nfctag && tarjeta.nfctag.id ? tarjeta.nfctag.id : 0,
        openfirst: false,
        servicio_list
      };

      const data = await this.tarjetas.update(dataForSave, tarjeta.id);
      this.isUpdate.next(false);

      if (data && data.dsc) {
        this.isUpdate.next(false);
        const tarjetas = {
          ...this.tarjetas.tarjetasByPersona,
          [Number(tarjeta.id)]: {
            ...this.tarjetas.tarjetasByPersona[Number(tarjeta.id)],
            tarjetaservicioList: servicio_list
          }
        };

        await this.storage.set('tarjetas', tarjetas);
        this.tarjetas.setTarjetasByPersona(tarjetas);

      } else {
        await this.toast.create('Error al actualizar una tarjeta');
      }
    } catch (e) {
      await this.toast.create('Error al actualizar una tarjeta');
      this.isUpdate.next(false);
      console.log(e);
    }
  }

  public abrirUrl(item: TarjetaServicio) {
    this.mostrarServicioEdicion(item);

  }

  private static mapServicios(servicio_list: TarjetaServicio[]): ServicioPost[] {
    return servicio_list.map((item, index) => ({
      ...item,
      share: item.share,
      orden: index + 1,
      idservicio: item.servicio.id,
      valor: item.valor,
    }));
  }

  async vincularTag(tarjeta: Tarjeta, texto: string) {

    if (!(await this.nfcService.nfcEnabled())) {
      return;
    }

    this.nfcService.nfcFromTagUnsubscripcion()

    if (this.plataforma === 'android') {

      this.subscriptions.push((this.nfcService.leerTagAndroid())
        .subscribe(async (data: any) => this.procesarNfc(tarjeta, texto, data)
          , err => {
            console.log(JSON.stringify(err))
            this.toast.create('Ocurrio un error, verifique la disponibilidad del sensor y pruebe de nuevamente', {duration: 3000})
            this.nfcService.alertDismiss();
            this.unsubscribeNfc()
            this.nfcService.nfcFromTag()
          })
      )
      this.nfcService.presentAlert("Apoye el dispositivo junto al tag")
    } else if (this.plataforma === 'ios') {
      this.procesarNfc(tarjeta, texto, this.nfcService.leerTagIos())
    }
  }

  async procesarNfc(tarjeta: Tarjeta, texto: string, data: any) {

    console.log('Creaste el nfc');

    this.nfcService.nfcFromTag()

    const ndefMsg = new Array(this.ndef.uriRecord(texto));

    const resp = await this.nfcCtrl.write(ndefMsg)
      .then(() => {
        return true
      })
      .catch(e => {
        return false
      })

    if (!resp) {
      await this.toast.create('Error de escritura en tag', { duration: 3000 })
      await this.nfcService.alertDismiss()
      this.unsubscribeNfc()
      return;
    }

    await this.nfcService.alertDismiss();

    this.nfcService.presentAlert("Vinculando el tag.")

    const identificador = this.nfcCtrl.bytesToHexString(data.tag.id || data.id)
    try {
      const infoTag = await this.tagService.getById(identificador);

      if (!infoTag) {
        await this.nfcService.alertDismiss();
        await this.toast.create('El tag no esta registrado', { duration: 3000 })
        this.unsubscribeNfc()
        return
      }

      // alert(JSON.stringify(infoTag))

      await this.nfcService.alertDismiss();

      if (!infoTag.activo && !infoTag.anulado) {

        tarjeta.nfctag = infoTag
        await this.actualizarTarjeta(tarjeta)
        await this.alert.alertMessage("Se ha vinculado con exito!");
        // await this.toast.create('Se ha vinculado con exito!', { duration: 3000 })

      } else {
        await this.toast.create('El tag ya esta vinculado a una tarjeta', { duration: 3000 })
      }
      await this.nfcService.alertDismiss();
      this.unsubscribeNfc()
    } catch (error) {
      console.log('error', error);
      await this.nfcService.alertDismiss();
      this.nfcService.nfcFromTag()
      await this.toast.create('Ocurrio un error, por favor vuelva a intentarlo', { duration: 3000 })
      this.unsubscribeNfc()
    }
  }

  unsubscribeNfc() {
    this.subscriptions.forEach(sub => {
      sub.unsubscribe();
    });
  }

  async desvincularTarjeta(tarjeta: Tarjeta) {

    if (!this.perfil?.perfil?.id) {
      return;
    }

    try {

      const servicio_list: any[] = TarjetasComponent.mapServicios(tarjeta.tarjetaservicioList);

      const dataForSave: TarjetaPost = {
        idpersona: this.perfil.perfil.id,
        nombretarjeta: tarjeta.nombretarjeta,
        idnfctag: 0,
        openfirst: false,
        servicio_list
      };

      const data = await this.tarjetas.update(dataForSave, tarjeta.id);

      this.isUpdate.next(false);

      if (data && data.dsc) {
        this.isUpdate.next(false);
        const tarjetas = {
          ...this.tarjetas.tarjetasByPersona,
          [Number(tarjeta.id)]: {
            ...this.tarjetas.tarjetasByPersona[Number(tarjeta.id)],
            tarjetaservicioList: servicio_list,
            nfctag: null
          }
        };

        await this.storage.set('tarjetas', tarjetas);
        this.tarjetas.setTarjetasByPersona(tarjetas);
        await this.toast.create('Tarjeta desvinculada');

      } else {
        await this.toast.create('Error al actualizar una tarjeta');
      }
    } catch (e) {
      await this.toast.create('Error al desvincular tarjeta');
      this.isUpdate.next(false);
      console.log(e);
    }
  }

  ngOnDestroy() {
    this.subscriptionExit.unsubscribe();
  }
}
