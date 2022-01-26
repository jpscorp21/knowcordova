import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, RouterStateSnapshot, Router, CanActivateChild} from '@angular/router';
import {PERFIL_KEY} from '../util/constants';

@Injectable({providedIn: 'root'})
export class AuthGuard implements CanActivateChild {
  constructor(private router: Router) {
  }

  canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    if (!localStorage.getItem(PERFIL_KEY)) {
      this.router.navigateByUrl('/login');
      return false;
    }
    return true;
  }
}
