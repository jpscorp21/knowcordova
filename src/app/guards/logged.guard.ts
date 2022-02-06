import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, RouterStateSnapshot, Router, CanActivateChild, CanActivate} from '@angular/router';
import {Persona} from '../interfaces/interface';
import {PERFIL_KEY} from '../util/constants';

@Injectable({providedIn: 'root'})
export class LoggedGuard implements CanActivate {
  constructor(private router: Router) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {

    if (localStorage.getItem(PERFIL_KEY)) {
      const perfil = JSON.parse(localStorage.getItem(PERFIL_KEY)) as Persona;

      if (perfil && perfil.id) {
        this.router.navigateByUrl('/tabs/cards/' + perfil.idtarjetaselected);
      } else {
        this.router.navigateByUrl('/tabs/cards/0');
      }
      return false;
    } else {
      return true;
    }

  }
}
