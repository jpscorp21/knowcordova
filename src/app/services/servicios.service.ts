import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {BehaviorSubject, of} from 'rxjs';
import {catchError, tap, timeout} from 'rxjs/operators';
import {environment} from 'src/environments/environment';
import {Servicio} from '../interfaces/interface';
import {contactoData} from "../util/contacto-data";

@Injectable({
  providedIn: 'root'
})
export class ServiciosService {

  url = environment.url;

  contactoData = contactoData;

  private serviciosSubject = new BehaviorSubject<Servicio[]>([]);
  public servicios$ = this.serviciosSubject.asObservable();

  get servicios() {
    return this.serviciosSubject.getValue();
  }

  constructor(
    private readonly http: HttpClient
  ) {
  }

  getAllProxy() {

    if (this.servicios && this.servicios.length) {
      return;
    }

    return this.getAll();
  }

  getAll() {
    return this.http.get<Servicio[]>(`${this.url}servicio`)
      .pipe(
        timeout(30000),
        catchError((e) => {
          console.log(e);
          return of([] as Servicio[]);
        }),
        tap((data) => {
          this.serviciosSubject.next([...data]);
        }),
      ).toPromise();
  }

}
