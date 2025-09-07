import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'tabs',
    pathMatch: 'full',
  },
  {
    path: 'home',
    loadComponent: () => import('./home/home.page').then((m) => m.HomePage),
  },
  {
    path: 'tabs',
    loadComponent: () => import('./tabs/tabs.page').then((m) => m.TabsPage),
    children: [
      {
        path: 'pagina1',
        loadComponent: () =>
          import('./pagina1/pagina1.page').then((m) => m.Pagina1Page),
      },
      {
        path: 'pagina2',
        loadComponent: () =>
          import('./pagina2/pagina2.page').then((m) => m.Pagina2Page),
      },
      {
        path: 'pagina3',
        loadComponent: () =>
          import('./pagina3/pagina3.page').then((m) => m.Pagina3Page),
      },

      // Páginas Martín
      {
        path: 'martin1',
        loadComponent: () =>
          import('./martin1/martin1.page').then((m) => m.Martin1Page),
      },
      {
        path: 'martin2',
        loadComponent: () =>
          import('./martin2/martin2.page').then((m) => m.Martin2Page),
      },
      {
        path: 'martin3',
        loadComponent: () =>
          import('./martin3/martin3.page').then((m) => m.Martin3Page),
      },
      {
        path: 'martin4',
        loadComponent: () =>
          import('./martin4/martin4.page').then((m) => m.Martin4Page),
      },
      {
        path: 'martin5',
        loadComponent: () =>
          import('./martin5/martin5.page').then((m) => m.Martin5Page),
      },
      {
        path: 'martin6',
        loadComponent: () =>
          import('./martin6/martin6.page').then((m) => m.Martin6Page),
      },

      // Redirección por defecto
      {
        path: '',
        redirectTo: 'pagina1',
        pathMatch: 'full',
      },
    ],
  },
];
