// INTERFACES
export interface Menu {
  title: string;
  url?: string;
  icon: string;
  iconUrl?: string;
  submenu?: Menu[];
}

export interface Friend {
  id: number;
  followerfecha: any;
  followerfechaconectado: any;
  followingfecha: any;
  followingfechaconectado: any;
  personanombre: string;
  idfriend: number;
  idtarjeta: number;
  idpersona: number;
  friendnombre: string;
  friendAvatar: string;
}

export interface FriendCreate {
  idpersona: number;
  idfriend: number;
  followerfecha: number;
}

export interface FriendUpdate {
  idpersona: number;
  idfriend: number;
  followerfechaconectado: number;
}

export interface FriendPost {
  idpersona: number;
  idtarjeta: any;  
}

export interface FriendPut {
  idpersona?: number;
  idfriend?: any;
  followerfechaconectado?: number;
  followingfechaconectado?: number;
}


export interface Persona {
  id: number;
  email: string;
  password: string;
  nombre: string;
  username: string;
  apellido: string;
  telefono: string;
  link: string;
  logo?: string;
  avatar?: string;
  portaladmin: boolean;
  followrequest?: boolean;
  autofollowaftertapping?: boolean;
  idtarjetaselected?: any;
  isChange?: boolean;
  following: number;
  followers: number;
}

export interface PersonaUpdate {
  email?: string;
  password?: string;
  nombre?: string;
  username?: string;
  apellido?: string;
  telefono?: string;
  link?: string;
  logo?: string;
  avatar?: string;
  portaladmin?: boolean;
  followrequest?: boolean;
  autofollowaftertapping?: boolean;
  idtarjetaselected?: any;
  isChange?: boolean;
}

export interface PersonaCount {
  status: string;
  dsc: string;
  following: number;
  followers: number;
}

export interface PersonaRegistro {
  email: string;
  password: string;
  nombre: string;
  username: string;
  avatar?: string;
  telefono?: string;
  apellido?: string;
}

export interface PersonaVerificacionEmailResponse {
  status: string;
  dsc: string;
  codigo: number;
}

export interface PersonaRegistroResponse {
  status: string;
  dsc: string;
  id: number;
}

export interface PersonaLogin {
  email: string;
  password: string;
}

export interface PersonaResetPassword {
  password: string;
}

export interface Servicio {
  logo?: string;
  share?: boolean;
  id: number;
  property: string;
  type: string;
  prefix: string;
  helper?: string;
  value?: string;
  valor?: string;
}

export interface Tarjeta {
  id: number;
  nombretarjeta: string;
  openfirst: boolean;
  fechacreacion: any;
  nfctag?: Nfctag;
  tarjetaservicioList: TarjetaServicio[];
  idpersona: number;
}

export interface TarjetaPost {
  idpersona: number;
  nombretarjeta: string;
  openfirst?: boolean;
  idnfctag?: any;
  servicio_list?: ServicioPost[]
}

export interface ServicioPost {
  idservicio: number;
  valor: string;
  orden?: number;
  share: boolean;
}

export interface TarjetaServicio {
  id: number;
  orden: number;
  valor: string;
  share: boolean;
  helper?: string;
  servicio: Servicio;
}

export interface TarjetaServicioPost {
  idtarjeta: number;
  idservicio: number;
  share: boolean;
  valor: any;
  orden?: number;
}

export interface TarjetaServicioUpdate {
  orden: number;
  share: boolean;
  valor: any;
  idtarjeta?: number;
  idservicio?: number;
}

export interface Nfctag {
  id: number;
  activo: boolean;
  anulado: boolean;
  identificador: string;
  fechacarga: any;
}

export interface PersonaAmigo {
  idfriend: number;
  idpersona: number;
  nombre: string;
  apellido: string;
  avatar?: string;
  idtarjeta?: number;
  tarjetanombre: string;
  followerfecha?: any;
  followerfechaconectado?: any;
}

export interface PersonaFollowers {
  followers: PersonaAmigo[];
}

export interface PersonaFollowing {
  following: PersonaAmigo[];
}

export interface PersonaFollowersFollowing {
  followers: PersonaAmigo[];
  following: PersonaAmigo[];
}


export interface FriendRequest {
  idpersona: number;  
  idtarjeta: number;  
}

