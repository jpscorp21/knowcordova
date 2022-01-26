import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {BehaviorSubject, of} from 'rxjs';
import {environment} from 'src/environments/environment';
import {PersonaRegistroResponse, Tarjeta, TarjetaPost} from '../interfaces/interface';
import {catchError, map, tap, timeout} from 'rxjs/operators';
import {Storage} from '@ionic/storage';


@Injectable({
  providedIn: 'root'
})
export class TarjetasService {

  url = environment.url;

  private loadingSubject = new BehaviorSubject<boolean>(false);
  public loading$ = this.loadingSubject.asObservable();

  private tarjetasSubject = new BehaviorSubject<Tarjeta[]>([]);
  public tarjetas$ = this.tarjetasSubject.asObservable();

  private tarjetasByPersonaSubject = new BehaviorSubject<{ [key: number]: Tarjeta }>({});
  public tarjetasByPersona$ = this.tarjetasByPersonaSubject.asObservable();

  get tarjetas() {
    return this.tarjetasSubject.getValue();
  }

  get tarjetasByPersona() {
    return this.tarjetasByPersonaSubject.getValue();
  }

  constructor(
    private readonly http: HttpClient,
    public storage: Storage
  ) {
  }

  getAll() {
    if (this.tarjetas && this.tarjetas.length) {
      return;
    }

    return this.http.get<Tarjeta[]>(`${this.url}tarjeta`)
      .pipe(
        timeout(30000),
        catchError((e) => {
          console.log(e);
          return of([] as Tarjeta[]);
        }),
        tap((data) => {
          this.tarjetasSubject.next([...data]);
        }),
      ).toPromise();
  }

  async getByIdPromise(id: number) {

    return await this.http.get<Tarjeta>(`${this.url}tarjeta/${id}`)
      .pipe(
        timeout(30000),
        catchError((e) => {
          console.log(e);
          return of(null);
        }),
      ).toPromise();
  }

  getById(id: number) {
    return this.http.get<Tarjeta>(`${this.url}tarjeta/${id}`)
      .pipe(
        timeout(30000),
        catchError((e) => {
          console.log(e);
          return of(null as Tarjeta);
        }),
      )
  }

  getByPersonaProxy(id: number) {
    if (this.tarjetasByPersona && Object.keys(this.tarjetasByPersona).length > 0) {
      return;
    }

    return this.getByPersona(id);
  }

  getByPersona(id: number) {
    this.loadingSubject.next(true)
    return this.http.get<Tarjeta[]>(`${this.url}tarjeta/byidpersona/${id}`)
      .pipe(
        timeout(30000),
        catchError((e) => {
          console.log(e);
          this.loadingSubject.next(false)
          return of([] as Tarjeta[]);
        }),
        map(this.mapTarjetas),
        tap((data) => {
          this.storage.set('tarjetas', {...data});
          this.loadingSubject.next(false)
          this.tarjetasByPersonaSubject.next({...data});
        }),
      ).toPromise();
  }

  setTarjetasByPersona(data: any) {
    this.tarjetasByPersonaSubject.next({...data});
  }

  resetByPersona() {
    this.tarjetasByPersonaSubject.next([]);
  }

  async create(body: TarjetaPost): Promise<PersonaRegistroResponse | null> {
    return await this.http.post<PersonaRegistroResponse | null>(`${this.url}tarjeta`, body).pipe(
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

  async remove(id: number) {
    return await this.http.delete(`${this.url}tarjeta/${id}`).pipe(
      timeout(15000),
      catchError(e => {
        console.log(e);
        return of(null);
      })
    ).toPromise();
  }

  async update(body: TarjetaPost, id: number): Promise<PersonaRegistroResponse | null> {
    return await this.http.put<PersonaRegistroResponse | null>(`${this.url}tarjeta/${id}`, body).pipe(
      timeout(15000),
      catchError(e => {
        console.log(e);
        return of(null);
      }),
      tap((result) => {
        console.log('Put tarjeta', result);
      })
    ).toPromise();
  }

  getTarjeta(id: number) {
    return this.tarjetasByPersona$.pipe( 
      map((tarjetas) => tarjetas[id]),
    );
  }

  getTarjetas() {
    return this.tarjetasByPersona$.pipe(map((tarjetas) => Object.values(tarjetas)));
  }

  mapTarjetas(data: Tarjeta[]) {
    const object: { [key: number]: Tarjeta } = {};

    for (const item of data) {
      if (!object[item.id]) {
        object[item.id] = {...item};
      }
    }

    return object;
  }

}
