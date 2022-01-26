import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {BehaviorSubject, forkJoin, of} from 'rxjs';
import {catchError, tap, timeout} from 'rxjs/operators';
import {environment} from 'src/environments/environment';
import {
  Friend,
  FriendPost,
  FriendPut, FriendRequest, Persona, PersonaAmigo,
  PersonaFollowers,
  PersonaFollowersFollowing,
  PersonaFollowing
} from '../interfaces/interface';
import {PerfilService} from "./perfil.service";
import {PERFIL_KEY} from "../util/constants";

@Injectable({
  providedIn: 'root'
})
export class AmigosService {

  public amigoData: PersonaAmigo = null;

  private loadingSubject = new BehaviorSubject<boolean>(false);
  public loading$ = this.loadingSubject.asObservable();

  constructor(
    private readonly http: HttpClient,
    private readonly perfil: PerfilService
  ) {
  }

  url = environment.url;

  private amigosSubject = new BehaviorSubject<Friend[]>([]);
  public amigosServicios$ = this.amigosSubject.asObservable();

  private amigosByPersonaSubject = new BehaviorSubject<PersonaFollowersFollowing>({followers: [], following: []});
  public amigosByPersona$ = this.amigosByPersonaSubject.asObservable();

  get amigos() {
    return this.amigosSubject.getValue();
  }

  get amigosByPersona() {
    return this.amigosByPersonaSubject.getValue();
  }

  getAll() {
    if (this.amigos && this.amigos.length) {
      return;
    }

    return this.http.get<Friend[]>(`${this.url}friend`)
      .pipe(
        timeout(30000),
        catchError((e) => {
          console.log(e);
          return of([] as Friend[]);
        }),
        tap((data) => {
          this.amigosSubject.next([...data]);
        }),
      ).toPromise();
  }

  getByPersonaProxy(id: number) {
    if (this.amigosByPersona && this.amigosByPersona.following.length) {
      return;
    }

    return this.getByPersona(id);
  }

  getByPersona(id: number) {
    return this.http.get<Friend[]>(`${this.url}friend/byidpersona/${id}`)
      .pipe(
        timeout(30000),
        catchError((e) => {
          console.log(e);
          return of([] as Friend[]);
        }),
        tap((data) => {
          //this.amigosByPersonaSubject.next([...data]);
        }),
      ).toPromise();
  }

  getFriends(id: number) {
    this.loadingSubject.next(true);
    return forkJoin([this.getByPersonaFollowingCards(id), this.getByPersonaFollowersCards(id)]).pipe(
      catchError(e => {
        this.loadingSubject.next(false);
        return of([{followers: [], following: []}]);
      }),
      tap(([{following}, {followers}]) => {
        this.loadingSubject.next(false);
        this.amigosByPersonaSubject.next({following, followers});
      })
    )
    /*return this.http.get<Friend[]>(`${this.url}friend/byidpersona/${id}`)
      .pipe(
        timeout(30000),
        catchError((e) => {
          console.log(e);
          return of([] as Friend[]);
        }),
        tap((data) => {
          this.amigosByPersonaSubject.next([...data]);
        }),
      ).toPromise();*/
  }

  getByPersonaFollowing(id: number) {
    return this.http.get<PersonaFollowing>(`${this.url}friend/following/${id}`)
      .pipe(
        timeout(30000),
        catchError((e) => {
          console.log(e);
          return of({following: []} as PersonaFollowing);
        }),
      )
  }

  getByPersonaFollowingCards(id: number) {
    return this.http.get<PersonaFollowing>(`${this.url}friend/followingcards/${id}`)
      .pipe(
        timeout(30000),
        catchError((e) => {
          console.log(e);
          return of({following: []} as PersonaFollowing);
        }),
      )
  }

  getByPersonaFollowers(id: number) {
    return this.http.get<PersonaFollowers>(`${this.url}friend/followers/${id}`)
      .pipe(
        timeout(30000),
        catchError((e) => {
          console.log(e);
          return of({followers: []} as PersonaFollowers);
        }),
      )
  }

  getByPersonaFollowersCards(id: number) {
    return this.http.get<PersonaFollowers>(`${this.url}friend/followercards/${id}`)
      .pipe(
        timeout(30000),
        catchError((e) => {
          console.log(e);
          return of({followers: []} as PersonaFollowers);
        }),
      )
  }

  resetByPersona() {
    this.amigosByPersonaSubject.next({following: [], followers: []});
  }

  async create(body: FriendPost) {
    return await this.http.post(`${this.url}friend`, body).pipe(
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

  async update(body: FriendPut, idfriend) {
    return await this.http.put(`${this.url}friend/${idfriend}`, body).pipe(
      timeout(15000),
      catchError(e => {
        console.log(e);
        return of(null);
      }),
      tap(() => {
        const amigos = this.amigosByPersona;
        this.amigosByPersonaSubject.next({
          ...amigos,
          followers: amigos.followers.map(item => item.idfriend === body.idfriend ? {...item, followerfechaconectado: body.followerfechaconectado} : item )
        })
        
        // this.amigosByPersonaSubject.next(this.amigosByPersona.filter(amigo => amigo.id === id ?))
        // this.tar.next(Object.assign([]));
        // this.reservasActivasSubject.next(Object.assign([]));
        // this.getReservas(this.perfil.perfil.idpersona).toPromise();
      })
    ).toPromise();
  }

  async remove(id: number, segmentValue: string) {
    return await this.http.delete(`${this.url}friend/${id}`).pipe(
      timeout(15000),
      catchError(e => {
        console.log(e);
        return of(null);
      }),
      tap((result) => {

        const amigos = this.amigosByPersona;
        const {followers, following} = this.perfil.perfil

        if (segmentValue === "followers") {
          this.amigosByPersonaSubject.next({
            ...amigos,
            followers: this.mapFilterFriend(amigos.followers, id)
          })

          const data: Persona = {
            ...this.perfil.perfil,
            followers: !followers || followers === 0 ? 0 : followers - 1
          }

          localStorage.setItem(PERFIL_KEY, JSON.stringify(data));
          this.perfil.setPerfil(data);
        }

        if (segmentValue === "following") {
          this.amigosByPersonaSubject.next({
            ...amigos,
            following: this.mapFilterFriend(amigos.following, id)
          })

          const data: Persona = {
            ...this.perfil.perfil,
            following: !following || following === 0 ? 0 : following - 1
          }

          localStorage.setItem(PERFIL_KEY, JSON.stringify(data));
          this.perfil.setPerfil(data);
        }

      })
    ).toPromise();
  }

  async postFriend(body: FriendRequest) {
    return await this.http.post<any>(`${this.url}friend`, body).pipe(
      tap((result) => {

        const {following} = this.perfil.perfil

        const data: Persona = {
          ...this.perfil.perfil,
          following: !following || following === 0 ? 0 : following - 1
        }

        localStorage.setItem(PERFIL_KEY, JSON.stringify(data));
        this.perfil.setPerfil(data);
      })
    )
      .toPromise();
  }

  private mapFilterFriend(persona: PersonaAmigo[], id: number) {
    return persona.filter(amigo => amigo.idfriend !== id)
  }
}
