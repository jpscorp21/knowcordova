import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {map} from 'rxjs/operators';
import {TarjetaServicio} from 'src/app/interfaces/interface';
import {AmigosService} from 'src/app/services/amigos.service';
import {PerfilService} from 'src/app/services/perfil.service';
import {TarjetaservicioService} from 'src/app/services/tarjetaservicio.service';
import {UrlService} from "../../services/url.service";

@Component({
  selector: 'app-perfil-seguidor',
  templateUrl: './perfil-seguidor.page.html',
  styleUrls: ['./perfil-seguidor.page.scss'],
})
export class PerfilSeguidorPage implements OnInit {

  constructor(
    public perfil: PerfilService,
    public tarjetaServicios: TarjetaservicioService,
    public amigos: AmigosService,
    public router: Router,
    public route: ActivatedRoute,
    public urlService: UrlService
  ) {
  }

  servicios$ = this.tarjetaServicios.getByAmigo(Number(this.route.snapshot.params.id)).pipe(
    map((data): TarjetaServicio[] => {
      const keys = Object.keys(data);
      if (keys.length) {
        console.log('entras');
        return data[keys[0]];
      } else {
        return [];
      }
    })
  );


  goTarjetas() {
    this.router.navigateByUrl('/tabs/tarjetas');
  }

  public abrirUrl(item: TarjetaServicio) {
    this.urlService.abrirUrl(item.servicio.prefix, item.valor)
  }

  ngOnInit() {
  }
}
