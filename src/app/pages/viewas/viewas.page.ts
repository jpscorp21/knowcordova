import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {DomSanitizer} from '@angular/platform-browser';
import {Router} from '@angular/router';
import {BehaviorSubject, combineLatest} from 'rxjs';
import {map} from 'rxjs/operators';
import {TarjetaServicio} from 'src/app/interfaces/interface';
import {PerfilService} from 'src/app/services/perfil.service';
import {UtilService} from 'src/app/services/shared/util.service';
import {TarjetasService} from 'src/app/services/tarjetas.service';
import {TarjetaservicioService} from 'src/app/services/tarjetaservicio.service';
import {UrlService} from "../../services/url.service";

@Component({
  selector: 'app-viewas',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './viewas.page.html',
  styleUrls: ['./viewas.page.scss'],
})
export class ViewasPage implements OnInit {

  isDrag = new BehaviorSubject(false);

  constructor(
    public perfil: PerfilService,
    public tarjetaServicios: TarjetaservicioService,
    public router: Router,
    public sanitizer: DomSanitizer,
    public util: UtilService,
    public tarjetas: TarjetasService,
    public urlService: UrlService
  ) {
  }

  styleImg(url: string) {
    return this.util.styleImg(url);
  }

  styleImgDefault(url: string) {
    return this.util.styleImgDefault(url);
  }

  ngOnInit() {
  }

  tarjeta$ = combineLatest([this.tarjetas.tarjetasByPersona$, this.perfil.perfil$]).pipe(
    map(([tarjetas, perfil]) => tarjetas[perfil.idtarjetaselected])
  )

  servicios$ = combineLatest([
    this.tarjetaServicios.tarjetaServiciosByPersona$,
    this.perfil.perfil$
  ]).pipe(
    map(([data, perfil]): TarjetaServicio[] => {
      const keys = Object.keys(data);
      if (keys.length) {
        return data[perfil.idtarjetaselected || keys[0]];
      } else {
        return [];
      }
    })
  )

  goTarjetas() {
    this.router.navigateByUrl('/tabs/tarjetas')
  }

  public abrirUrl(item: TarjetaServicio) {
    this.urlService.abrirUrl(item.servicio.prefix, item.valor)
  }

}
