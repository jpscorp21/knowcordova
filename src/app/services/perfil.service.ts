import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {Persona} from '../interfaces/interface';
import {PERFIL_KEY} from '../util/constants';

@Injectable({
  providedIn: 'root'
})
export class PerfilService {

  private perfilSubject = new BehaviorSubject<Persona | null>(null);
  public perfil$ = this.perfilSubject.asObservable();

  private changePerfilAction = new BehaviorSubject<Persona | null>(null);
  changePerfilAction$ = this.changePerfilAction.asObservable();

  get perfil() {
    return this.perfilSubject.getValue();
  }

  constructor() {
  }

  initPerfil() {
    if (localStorage.getItem(PERFIL_KEY)) {
      const perfilJson = localStorage.getItem(PERFIL_KEY);
      this.perfilSubject.next(JSON.parse(perfilJson));
      this.changePerfilAction.next(JSON.parse(perfilJson));

      return JSON.parse(perfilJson);
    } else {
      this.perfilSubject.next(JSON.parse(null));

      return null;
    }
  }

  setPerfil(perfil: Persona) {
    this.perfilSubject.next(perfil);
  }
}
