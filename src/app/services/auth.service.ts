import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {environment} from 'src/environments/environment';
import {
  Persona, PersonaCount,
  PersonaLogin,
  PersonaRegistro,
  PersonaRegistroResponse,
  PersonaUpdate,
  PersonaVerificacionEmailResponse
} from '../interfaces/interface';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  url = environment.url;
  form = null;
  codigo = 0;

  constructor(
    private readonly http: HttpClient
  ) {
  }

  getAll() {
    return this.http.get(`${this.url}persona`);
  }

  getByEmail(email: string) {
    return this.http.get(`${this.url}persona/byemail/${email}`);
  }

  getById(idpersona: number) {
    return this.http.get<Persona>(`${this.url}persona/${idpersona}`);
  }


  getByUsername(username: string) {
    return this.http.get<Persona>(`${this.url}persona/byusername/${username}`);
  }

  frientCount(idpersona: number) {
    return this.http.get<PersonaCount>(`${this.url}friend/count/${idpersona}`);
  }

  async register(body: PersonaRegistro) {
    return await this.http.post<PersonaRegistroResponse>(`${this.url}persona`, body).toPromise();
  }

  async resetPassword(body: PersonaLogin, id: number) {
    return await this.http.put<PersonaRegistroResponse>(`${this.url}persona/${id}`, body).toPromise();
  }

  async forgetPassword(body: PersonaLogin) {
    return await this.http.put<PersonaRegistroResponse>(`${this.url}persona/resetpass/${body.email}`, {password: body.password}).toPromise();
  }

  async login(body: PersonaLogin) {
    console.log('login', body);
    return await this.http.post(`${this.url}persona/bylogin`, body).toPromise();
  }

  async verificacionEmail(body: { email: string }) {
    return await this.http.post<PersonaVerificacionEmailResponse>(`${this.url}persona/codeverificationmail`, body).toPromise();
  }

  async updatePersona(id: any, body: PersonaUpdate) {
    console.log('update persona', body);
    return await this.http.put(`${this.url}persona/${id}`, body).toPromise();
  }
}
