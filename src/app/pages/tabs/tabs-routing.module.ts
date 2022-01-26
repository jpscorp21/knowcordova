import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {UserGuard} from 'src/app/guards/user.guard';

import {TabsPage} from './tabs.page';

const routes: Routes = [
  {
    path: '',
    component: TabsPage,
    data: {name: 'tabs'},
    children: [
      /*       {
              path: 'inicio',
              children: [
                {
                  path: '',
                  loadChildren: () =>
                    import('../inicio/inicio.module').then((m) => m.InicioPageModule),
                },
              ],
            }, */
      {
        path: 'amigos',
        children: [
          {
            path: '',
            data: {name: 'amigos'},
            loadChildren: () =>
              import('../amigos/amigos.module').then((m) => m.AmigosPageModule),
          },
        ],
      },
      {
        path: 'perfil',
        children: [
          {
            path: '',
            data: {name: 'perfil'},
            loadChildren: () =>
              import('../perfil/perfil.module').then((m) => m.PerfilPageModule),
          },
        ],
      },
      {
        path: 'compartir',
        children: [
          {
            path: '',
            data: {name: 'compartir'},
            loadChildren: () =>
              import('../compartir/compartir.module').then((m) => m.CompartirPageModule),
          },
        ],
      },
      {
        path: 'qr',
        children: [
          {
            path: '',
            data: {name: 'qr'},
            loadChildren: () =>
              import('../qr/qr.module').then((m) => m.QrPageModule),
          },
        ],
      },
      {
        path: 'crear-tarjeta',
        children: [
          {
            path: '',
            data: {name: 'crear-tarjeta'},
            loadChildren: () =>
              import('../crear-tarjeta/crear-tarjeta.module').then((m) => m.CrearTarjetaPageModule),
          },
        ],
      },
      {
        path: 'crear-tarjeta/:id',
        children: [
          {
            path: '',
            data: {name: 'crear-tarjeta'},
            loadChildren: () =>
              import('../crear-tarjeta/crear-tarjeta.module').then((m) => m.CrearTarjetaPageModule),
          },
        ],
      },
      {
        path: 'tarjetas',
        children: [
          {
            path: '',
            loadChildren: () =>
              import('../tarjetas/tarjetas.module').then((m) => m.TarjetasPageModule),
          },
        ],
        data: {name: 'tarjetas'}
      },
      {
        path: 'perfil-seguidor/:id',
        children: [
          {
            path: '',
            loadChildren: () =>
              import('../perfil-seguidor/perfil-seguidor.module').then((m) => m.PerfilSeguidorPageModule),
          },
        ],
        data: {name: 'perfil-seguidor'}
      },
      // {
      //   path: 'login',
      //   children: [
      //     {
      //       path: '',
      //       loadChildren: () =>
      //         import('../login/login.module').then((m) => m.LoginPageModule),
      //     },
      //   ],
      // },
      // {
      //   path: 'registro',
      //   children: [
      //     {
      //       path: '',
      //       loadChildren: () =>
      //         import('../registro/registro.module').then((m) => m.RegistroPageModule),
      //     },
      //   ],
      // },
      {
        path: 'reset-password',
        children: [
          {
            path: '',
            data: {name: 'reset-password'},
            loadChildren: () =>
              import('../reset-password/reset-password.module').then((m) => m.ResetPasswordPageModule),
          },
        ],
      },
      {
        path: 'tags',
        children: [
          {
            path: '',
            loadChildren: () =>
              import('../tags/tags.module').then((m) => m.TagsPageModule),
          },
        ],
      },
      {
        path: 'cards/:id',
        children: [
          {
            path: '',
            data: {name: 'cards'},
            loadChildren: () =>
              import('../cards/cards.module').then((m) => m.CardsPageModule),
          },
        ],
      },
      {
        path: 'privacidad',
        children: [
          {
            path: '',
            data: {name: 'privacidad'},
            loadChildren: () =>
              import('../privacidad/privacidad.module').then((m) => m.PrivacidadPageModule),
          },
        ],
      },
      {
        path: 'viewas',
        children: [
          {
            path: '',
            data: {name: 'viewas'},
            loadChildren: () =>
              import('../viewas/viewas.module').then((m) => m.ViewasPageModule),
          },
        ],
      },
      {
        path: 'acercade',
        children: [
          {
            path: '',
            data: {name: 'acercade'},
            loadChildren: () =>
              import('../acercade/acercade.module').then((m) => m.AcercadePageModule),
          },
        ],
      },
      {
        path: 'tutorial',
        children: [
          {
            path: '',
            data: {name: 'tutorial'},
            loadChildren: () =>
              import('../tutorial/tutorial.module').then((m) => m.TutorialPageModule),
          },
        ],
      },
      {
        path: 'tutorial-detalle/:id',
        children: [
          {
            path: '',
            data: {name: 'tutorial-detalle'},
            loadChildren: () =>
              import('../tutorial-detalle/tutorial-detalle.module').then((m) => m.TutorialDetallePageModule),
          },
        ],
      },
      {
        path: 'perfil-edicion',
        children: [
          {
            path: '',
            data: {name: 'perfil-edicion'},
            loadChildren: () =>
              import('../perfil-edicion/perfil-edicion.module').then((m) => m.PerfilEdicionPageModule),
          },
        ],
      },
      {
        path: 'terminos-condiciones',
        children: [
          {
            path: '',
            data: {name: 'terminos-condiciones'},
            loadChildren: () =>
              import('../terminos-condiciones/terminos-condiciones.module').then((m) => m.TerminosCondicionesPageModule),
          },
        ]
      },
      {
        path: '',
        redirectTo: 'compartir',
        pathMatch: 'full'
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TabsPageRoutingModule {
}
