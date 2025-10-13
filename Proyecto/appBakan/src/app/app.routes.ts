import { Routes } from '@angular/router';

export const routes: Routes = [

  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: 'login',
    loadComponent: () => import('./login/login.page').then( m => m.LoginPage)
  },
    {
    path: 'inicio',
    loadComponent: () => import('./pagina-inicio/pagina-inicio.page').then( m => m.PaginaInicioPage)
  },
  {
    path: 'listadoPacientes', 
    loadComponent: () => import('./listado-pacientes/listado-pacientes.page').then( m => m.ListadoPacientesPage)
  },

  {
    path: 'perfilPaciente', //
    loadComponent: () => import('./perfil-paciente/perfil-paciente.page').then( m => m.PerfilPacientePage)
  },

  {
    path: 'fichaMedica',
    loadComponent: () => import('./ficha-medica/ficha-medica.page').then( m => m.FichaMedicaPage)
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
    path: 'historial/:id',
    loadComponent: () => import('./matias7/matias7.page').then( m => m.Matias7Page)
  },


  {
    path: 'ficha-medica',
    loadComponent: () => import('./ficha-medica/ficha-medica.page').then( m => m.FichaMedicaPage)
  },
  {
    path: 'listado-pacientes',
    loadComponent: () => import('./listado-pacientes/listado-pacientes.page').then( m => m.ListadoPacientesPage)
  },
  {
    path: 'perfil-paciente',
    loadComponent: () => import('./perfil-paciente/perfil-paciente.page').then( m => m.PerfilPacientePage)
  },
  {
    path: 'pagina-inicio',
    loadComponent: () => import('./pagina-inicio/pagina-inicio.page').then( m => m.PaginaInicioPage)
  },



  


];


