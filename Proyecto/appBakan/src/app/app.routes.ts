import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'home',
    loadComponent: () => import('./home/home.page').then((m) => m.HomePage),
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: 'pagina2', //MARTIN
    loadComponent: () => import('./pagina2/pagina2.page').then( m => m.Pagina2Page)
  },
  {
    path: 'pagina3', //MATIAS
    loadComponent: () => import('./pagina3/pagina3.page').then( m => m.Pagina3Page)
  },
  {
    path: 'pagina1', //MARCIAL
    loadComponent: () => import('./pagina1/pagina1.page').then( m => m.Pagina1Page)
  },
];
