import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';
import { UserGuard } from './guards/user.guard';
import { SelectiveLoadingStrategy } from './selective-loading-strategy';

const routes: Routes = [
  {
    path: 'tabs',
    canActivateChild: [AuthGuard],
    loadChildren: () => import('./pages/tabs/tabs.module').then(m => m.TabsPageModule),
    data: {name: 'tabs'}
  },
  {
    path: '',
    redirectTo: 'inicio',
    pathMatch: 'full'
  },
  {
    path: 'inicio',
    canActivateChild: [UserGuard],
    loadChildren: () => import('./pages/inicio/inicio.module').then(m => m.InicioPageModule),
    data: {name: 'inicio'}
  },
  {
    path: 'login',
    loadChildren: () => import('./pages/login/login.module').then(m => m.LoginPageModule),
    data: {name: 'login'}
  },
  {
    path: 'registro',
    loadChildren: () => import('./pages/registro/registro.module').then(m => m.RegistroPageModule),
    data: {name: 'registro'}
  },
  {
    path: 'crear-tarjeta',
    canActivateChild: [AuthGuard],
    loadChildren: () => import('./pages/crear-tarjeta/crear-tarjeta.module').then(m => m.CrearTarjetaPageModule),
    data: {name: 'crear-tarjetas'}
  },
  {
    path: 'tarjetas',
    canActivateChild: [AuthGuard],
    loadChildren: () => import('./pages/tarjetas/tarjetas.module').then(m => m.TarjetasPageModule),
    data: {name: 'tarjetas'}
  },
  {
    path: 'perfil-seguidor',
    loadChildren: () => import('./pages/perfil-seguidor/perfil-seguidor.module').then(m => m.PerfilSeguidorPageModule)
  },
  {
    path: 'autenticacion',
    loadChildren: () => import('./pages/autenticacion/autenticacion.module').then(m => m.AutenticacionPageModule)
  },
  {
    path: 'tutorial-detalle',
    loadChildren: () => import('./pages/tutorial-detalle/tutorial-detalle.module').then(m => m.TutorialDetallePageModule)
  },
  {
    path: 'terminos-condiciones',
    loadChildren: () => import('./pages/terminos-condiciones/terminos-condiciones.module').then(m => m.TerminosCondicionesPageModule)
  },
  {
    path: 'forget-password',
    loadChildren: () => import('./pages/forget-password/forget-password.module').then( m => m.ForgetPasswordPageModule)
  },



  /*
  {
    path: 'reset-password',
    loadChildren: () => import('./pages/reset-password/reset-password.module').then( m => m.ResetPasswordPageModule)
  },
  {
    path: 'tags',
    loadChildren: () => import('./pages/tags/tags.module').then( m => m.TagsPageModule)
  },   {
    path: 'cards',
    loadChildren: () => import('./pages/cards/cards.module').then( m => m.CardsPageModule)
  },
  {
    path: 'privacidad',
    loadChildren: () => import('./pages/privacidad/privacidad.module').then( m => m.PrivacidadPageModule)
  },
  {
    path: 'amigos',
    loadChildren: () => import('./pages/amigos/amigos.module').then( m => m.AmigosPageModule)
  },
  {
    path: 'viewas',
    loadChildren: () => import('./pages/viewas/viewas.module').then( m => m.ViewasPageModule)
  },
  {
    path: 'acercade',
    loadChildren: () => import('./pages/acercade/acercade.module').then( m => m.AcercadePageModule)
  },
  {
    path: 'tutorial',
    loadChildren: () => import('./pages/tutorial/tutorial.module').then( m => m.TutorialPageModule)
  },   {
    path: 'perfil-edicion',
    loadChildren: () => import('./pages/perfil-edicion/perfil-edicion.module').then( m => m.PerfilEdicionPageModule)
  },
   */


];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: SelectiveLoadingStrategy })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
