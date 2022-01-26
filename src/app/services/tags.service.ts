import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable, of} from 'rxjs';
import {catchError, tap, timeout} from 'rxjs/operators';
import {environment} from 'src/environments/environment';
import {Nfctag} from '../interfaces/interface';

@Injectable({
  providedIn: 'root'
})
export class TagsService {

  public url = environment.url;
  public nfcTags$: Observable<Nfctag[]>;

  private nfcTagsSubject = new BehaviorSubject<Nfctag[]>([]);

  get nfcTags() {
    return this.nfcTagsSubject.getValue();
  }

  constructor(
    private readonly http: HttpClient
  ) {
    this.nfcTags$ = this.nfcTagsSubject.asObservable();
  }

  getAll() {
    if (this.nfcTags && this.nfcTags.length) {
      return;
    }

    return this.http.get<Nfctag[]>(`${this.url}nfctag`)
      .pipe(
        timeout(30000),
        catchError((e) => {
          console.log(e);
          return of([] as Nfctag[]);
        }),
        tap((data) => {
          this.nfcTagsSubject.next([...data]);
        }),
      ).toPromise();
  }

  async getById(identificador: string) {
    return await this.http.get<Nfctag>(`${this.url}nfctag/byidentificador/${identificador}`).toPromise();
  }
}
