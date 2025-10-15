import { Routes } from '@angular/router';


export const routes: Routes = [ 

  {
    path: '',
    redirectTo: 'inicio',
    pathMatch: 'full',
  },
  {
    path: 'listadoPacientes',
    loadComponent: () => import('./test/test.page').then((m) => m.TestPage),
  },
   {
       path: 'inicio',
       loadComponent: () => import('./pagina-inicio/pagina-inicio.page').then( m => m.PaginaInicioPage)
     },
       
     {
       path: 'perfilPaciente', //
       loadComponent: () => import('./perfil-paciente/perfil-paciente.page').then( m => m.PerfilPacientePage)
     },
    
     {
       path: 'fichaMedica',
       loadComponent: () => import('./ficha-medica/ficha-medica.page').then( m => m.FichaMedicaPage)
     },
     /* 
     {
      path: 'login',
      loadComponent: () => import('./login/login.page').then( m => m.LoginPage)
    },


*/

]