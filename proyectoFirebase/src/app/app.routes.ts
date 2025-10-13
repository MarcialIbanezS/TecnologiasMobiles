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
 
  



];


