import {ChangeDetectionStrategy, Component, OnDestroy, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {PersonaAmigo} from 'src/app/interfaces/interface';
import {AmigosService} from 'src/app/services/amigos.service';
import {UtilService} from "../../services/shared/util.service";
import {BehaviorSubject, Subscription} from "rxjs";
import {PerfilService} from "../../services/perfil.service";
import {ModalController, Platform} from "@ionic/angular";
import {TarjetaAmigoModalComponent} from "../../components/tarjeta-amigo-modal/tarjeta-amigo-modal.component";
import {AlertService} from "../../services/shared/alert.service";

type Segment =  "followers" | "following" | "pendiente";

@Component({
  selector: 'app-amigos',
  templateUrl: './amigos.page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./amigos.page.scss'],
})
export class AmigosPage implements OnInit, OnDestroy {

  search = new BehaviorSubject('');

  segmentValue: Segment = 'following';

  subscriptionExit = new Subscription();

  nombreSeguidores = [
    {id: 1, name: 'Abigail', detalleSeguidor: 'Mejores Amigos'},
    {id: 2, name: 'José', detalleSeguidor: 'Amigos'},
    {id: 3, name: 'Hernan', detalleSeguidor: 'Familia'},
    {id: 4, name: 'Marcelo', detalleSeguidor: 'Trabajo'},
    {id: 5, name: 'Gabriela', detalleSeguidor: 'Amigos'},
    {id: 6, name: 'Rosana', detalleSeguidor: 'Mejores Amigos'}
  ];

  constructor(
    private amigosService: AmigosService,
    private readonly router: Router,
    private readonly perfil: PerfilService,
    private readonly alert: AlertService,
    private readonly modal: ModalController,
    private readonly platform: Platform,
    public util: UtilService,
  ) {

  }

  get loading$() {
    return this.amigosService.loading$;
  }

  async ionViewDidEnter() {
    if (this.perfil.perfil) {
      await this.amigosService.getFriends(this.perfil.perfil.id).toPromise()
      await this.amigosService.getByPersona(this.perfil.perfil.id)
    }

    this.subscriptionExit = this.platform.backButton.subscribe(() => {      
        const tarjetaSelected = this.perfil.perfil?.idtarjetaselected ?? 0  
        if (tarjetaSelected) {
          this.router.navigateByUrl('/tabs/cards/' + tarjetaSelected);
        } else {
          this.router.navigateByUrl('/tabs/cards/0');
        }      
    }); 
  }

  styleImgDefault(url: string) {
    return `url(${url}) center no-repeat`;
  }

  styleImgWithData(url: string) {
    return this.util.styleImgWithData(url);
  }

  get amigos$() {
    return this.amigosService.amigosByPersona$
  }

  ngOnInit() {
  }

  async mostrarAmigo(amigo: PersonaAmigo) {
    // TODO - Volver a poner los amigos despues
    this.amigosService.amigoData = {...amigo};

    if (this.segmentValue === "followers") {
      return;
    }

    const modal = await this.modal.create({
      component: TarjetaAmigoModalComponent,
      mode: 'ios',
      componentProps: {
        amigo,
        segment: this.segmentValue
      }
    })

    await modal.present();
    // this.router.navigateByUrl(`/tabs/perfil-seguidor/${amigo.idfriend}`);
  }

  changeSearch(event: any) {
    this.search.next(event.detail?.value);
  }

  async eliminarAmigo(amigo: PersonaAmigo) {

    if (!(await this.alert.alertOk('¿Estás seguro de eliminar a ' + amigo.nombre + ' ' + amigo.apellido + '?'))) {
      return;
    }

    if (!amigo) {
      return;
    }

    await this.amigosService.remove(amigo.idfriend, this.segmentValue)
  }

  segmentChanged(event: any) {
    this.segmentValue = event.detail.value
  }

  async aceptarAmigo(amigo: PersonaAmigo) {
    if (!(await this.alert.alertOk('¿Estás seguro de aceptar a ' + amigo.nombre + ' ' + amigo.apellido + '?'))) {
      return;
    }

    await this.amigosService.update({...amigo, followerfechaconectado: new Date().getTime()}, amigo.idfriend)
  }

  ngOnDestroy() {    
    this.subscriptionExit.unsubscribe();
  }
}
