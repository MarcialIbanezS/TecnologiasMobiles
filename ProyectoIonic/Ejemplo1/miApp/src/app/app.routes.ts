import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./tabs/tabs.routes').then((m) => m.routes),
  },
  {
    path: 'nombre-pagina',
    loadComponent: () => import('./nombre-pagina/nombre-pagina.page').then( m => m.NombrePaginaPage)
  },  {
    path: 'matias2',
    loadComponent: () => import('./matias2/matias2.page').then( m => m.Matias2Page)
  },
  {
    path: 'matias3',
    loadComponent: () => import('./matias3/matias3.page').then( m => m.Matias3Page)
  },
  {
    path: 'matias4',
    loadComponent: () => import('./matias4/matias4.page').then( m => m.Matias4Page)
  },
  {
    path: 'matias5',
    loadComponent: () => import('./matias5/matias5.page').then( m => m.Matias5Page)
  },
  {
    path: 'matias6',
    loadComponent: () => import('./matias6/matias6.page').then( m => m.Matias6Page)
  },
  {
    path: 'matias7',
    loadComponent: () => import('./matias7/matias7.page').then( m => m.Matias7Page)
  },
  {
    path: 'login',
    loadComponent: () => import('./login/login.page').then( m => m.LoginPage)
  },

];
