import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, of } from 'rxjs';
import { catchError, map, tap, timeout } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { ServicioPost, Tarjeta, TarjetaServicio, TarjetaServicioPost, TarjetaServicioUpdate } from '../interfaces/interface';

@Injectable({
  providedIn: 'root'
})
export class TarjetaservicioService {

  url = environment.url;

  private tarjetaServiciosSubject = new BehaviorSubject<TarjetaServicio[]>([]);
  public tarjetasServicios$ = this.tarjetaServiciosSubject.asObservable();

  private tarjetaServiciosByPersonaSubject = new BehaviorSubject<{[key: number]: TarjetaServicio[]}>({});
  public tarjetaServiciosByPersona$ = this.tarjetaServiciosByPersonaSubject.asObservable();  

  private loadingByPersonaSubject = new BehaviorSubject(false);
  public loadingByPersona = this.loadingByPersonaSubject.asObservable();

  private successByPersonaSubject = new BehaviorSubject(false);
  public successByPersona = this.successByPersonaSubject.asObservable();

  public servicios = new BehaviorSubject<TarjetaServicio[]>([]);

  get tarjetaServicios() {
    return this.tarjetaServiciosSubject.getValue();
  }

  get tarjetaServiciosByPersona() {
    return this.tarjetaServiciosByPersonaSubject.getValue();
  }

  constructor(
    private readonly http: HttpClient
  ) { }

  getAll() {
    if (this.tarjetaServicios && this.tarjetaServicios.length) {
      return;
    }

    return this.http.get<TarjetaServicio[]>(`${this.url}tarjetaservicio`)
    .pipe(
      timeout(30000),
      catchError((e) => {
        console.log(e);
        return of([] as TarjetaServicio[]);
      }),
      tap((data) => {
        this.tarjetaServiciosSubject.next([...data]);
      }),
    ).toPromise();
  }

  
  getByPersonaProxy(id: number) {
    if (this.tarjetaServiciosByPersona && Object.keys(this.tarjetaServiciosByPersona).length) {
      return;
    }    

    return this.getByPersona(id);
  }

  getByPersona(id: number) {  
    
    this.loadingByPersonaSubject.next(true);

    return this.http.get<TarjetaServicio[]>(`${this.url}tarjetaservicio/byidpersona/${id}`)
    .pipe(
      timeout(30000),
      catchError((e) => {
        console.log(e);
        this.loadingByPersonaSubject.next(false);
        return of([] as TarjetaServicio[]);
      }),

      tap((data) => {
        //console.log('tarjeta servicio', data);

        // const object = this.mapTarjetasServicios(data);

        // this.tarjetaServiciosByPersonaSubject.next({...object});
        // this.loadingByPersonaSubject.next(false);
        // this.successByPersonaSubject.next(true);
      }),
    ).toPromise();
  }

  getByAmigo(id: number) {  
    
    this.loadingByPersonaSubject.next(true);

    return this.http.get<TarjetaServicio[]>(`${this.url}tarjetaservicio/byidpersona/${id}`)
    .pipe(
      timeout(30000),
      catchError((e) => {
        console.log(e);
        this.loadingByPersonaSubject.next(false);
        return of([] as TarjetaServicio[]);
      }),
      // map((data) => {        
      //   return this.mapTarjetasServicios(data);        
      // }),
      tap(() => {
        this.loadingByPersonaSubject.next(false);
      })
    )
  }

  resetByPersona() {
    this.tarjetaServiciosByPersonaSubject.next({});    
  }

  async create(body: TarjetaServicioPost) {
    return await this.http.post(`${this.url}tarjetaservicio`, body).pipe(
      timeout(15000),
      catchError(e => {
        console.log(e);
        return of(null);
      }),
      tap((result) => {
        console.log('Post tarjeta', result);
        // this.tar.next(Object.assign([]));
        // this.reservasActivasSubject.next(Object.assign([]));
        // this.getReservas(this.perfil.perfil.idpersona).toPromise();
      })
    ).toPromise();
  }

  async post(body: TarjetaServicioPost) {
    return await this.http.post(`${this.url}tarjetaservicio`, body).pipe(
      timeout(15000),
      catchError(e => {
        console.log(e);
        return of(null);
      }),      
    ).toPromise();
  }

  async update(body: TarjetaServicioUpdate, id: number) {
    return await this.http.put(`${this.url}tarjetaservicio/${id}`, body).pipe(
      timeout(15000),
      catchError(e => {
        console.log(e);
        return of(null);
      }),      
    ).toPromise();
  }

  setServicio(id: number) {
    this.servicios.next(this.tarjetaServiciosByPersona[id]);
  }

  setFirstServicio() {
    const keys = Object.keys(this.tarjetaServiciosByPersona);
    if (keys.length) {
      this.servicios.next([...this.tarjetaServiciosByPersona[keys[0]]]);
    } else {
      this.servicios.next([]);
    }
  }

  updateTarjetaServicio(servicios: TarjetaServicio[], id: number) {
    const data = {
      ...this.tarjetaServiciosByPersona,
      [id]: servicios.map((item, index) => ({
        ...item,        
        orden: index + 1
      }))
    }

    this.tarjetaServiciosByPersonaSubject.next(data);
    
  }  

  updateTarjetaServicioByActualizar(tarjeta: Tarjeta, servicios: ServicioPost[], id: number) {
    const data = {
      ...this.tarjetaServiciosByPersona,
      [id]: this.servicios[id].map((item) => ({
        ...item,                
        tarjeta: {...tarjeta},        
        servicio: {
          ...item.servicio,
          value: servicios.find((item2) => Number(item2.idservicio === item.id)).valor
        }
      }))
    }

    this.tarjetaServiciosByPersonaSubject.next(data);        
  }

  // mapTarjetasServicios(data: TarjetaServicio[]) {
  //   const object: {[key: string]: TarjetaServicio[]} = {};

  //   for(const item of data) {
  //     if (!object[item.tarjeta.id]) {
  //       object[item.tarjeta.id] = [];
  //     }

  //     object[item.tarjeta.id].push({...item});
  //   }    

  //   return object;
  // }
}
