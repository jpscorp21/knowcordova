import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Menu } from '../interfaces/interface';

@Injectable({ providedIn: 'root' })
export class MenuService {

  public menu: Menu[] = [
    {
      title: 'Inicio',
      url: '/',
      icon: 'home-outline',
      iconUrl: '/assets/menu/home.svg'
    },
    {
      title: 'Mi Cuenta',
      url: '/perfil',
      icon: 'person-outline',
      iconUrl: '/assets/menu/person.svg'
    },
    {
      title: 'Explorar',
      url: 'tab/explorar',
      icon: 'image-outline',
      iconUrl: '/assets/menu/picture.svg'
    },
    {
      title: 'Mapa',
      url: 'tab/mapa',
      icon: 'map-outline',
      iconUrl: '/assets/menu/map.svg'
    },
    {
      title: 'QR',
      url: 'tab/qr',
      icon: 'qr-code-outline',
      iconUrl: '/assets/menu/qr.svg'
    },
    {
      title: 'Favoritos',
      url: 'tab/favoritos',
      icon: 'star-outline',
      iconUrl: '/assets/menu/star.svg'
    },
    {
      title: 'Reservas activas',
      url: 'tab/reservas-activas',
      icon: 'checkmark-outline',
      iconUrl: '/assets/menu/check.svg'
    },
    {
      title: 'Historial',
      url: 'tab/historial',
      icon: 'time-outline',
      iconUrl: '/assets/menu/time.svg'
    },
    {
      title: 'Eventos',
      url: 'tab/eventos',
      icon: 'calendar-outline',
      iconUrl: '/assets/menu/event.svg'
    },    
    {
      title: 'Ayudanos a mejorar',
      url: 'tab/ayudanos',
      icon: 'add',
      iconUrl: '/assets/menu/burbuja.svg'
    },    
    {
      title: 'Términos y condiciones',
      url: '/terminos',
      icon: 'document-outline',      
    },    
  ]

  private menuSubject: BehaviorSubject<Menu[]> = new BehaviorSubject<Menu[]>(this.menu);

  public menu$ = this.menuSubject.asObservable();

  constructor() { }

}
