import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'home',
    loadComponent: () => import('./home/home.page').then((m) => m.HomePage),
  },
  {
    path: '',
    redirectTo: 'login',
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

  {
    path: 'martin1',
    loadComponent: () => import('./martin1/martin1.page').then( m => m.Martin1Page)
  },
  {
    path: 'martin2',
    loadComponent: () => import('./martin2/martin2.page').then( m => m.Martin2Page)
  },
  {
    path: 'martin3',
    loadComponent: () => import('./martin3/martin3.page').then( m => m.Martin3Page)
  },
  {
    path: 'martin4',
    loadComponent: () => import('./martin4/martin4.page').then( m => m.Martin4Page)
  },
  {
    path: 'martin5',
    loadComponent: () => import('./martin5/martin5.page').then( m => m.Martin5Page)
  },
  {
    path: 'martin6',
    loadComponent: () => import('./martin6/martin6.page').then( m => m.Martin6Page)
  },
  
  {
    path: 'marcial6',
    loadComponent: () => import('./marcial6/marcial6.page').then( m => m.Marcial6Page)
  },
  {
    path: 'ingreso',
    loadComponent: () => import('./matias2/matias2.page').then( m => m.Matias2Page)
  },
  {
    path: 'ficha/:id',
    loadComponent: () => import('./matias3/matias3.page').then( m => m.Matias3Page)
  },
  {
    path: 'triage/:id',
    loadComponent: () => import('./matias4/matias4.page').then( m => m.Matias4Page)
  },
  {
    path: 'signos/:id',
    loadComponent: () => import('./matias5/matias5.page').then( m => m.Matias5Page)
  },
  {
    path: 'meds/:id',
    loadComponent: () => import('./matias6/matias6.page').then( m => m.Matias6Page)
  },
  {
    path: 'login',
    loadComponent: () => import('./login/login.page').then( m => m.LoginPage)
  },
  {
    path: 'historial/:id',
    loadComponent: () => import('./matias7/matias7.page').then( m => m.Matias7Page)
  },
  


];


