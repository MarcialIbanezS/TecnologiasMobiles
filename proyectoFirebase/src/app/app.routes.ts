import { Routes } from '@angular/router';


export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./test/test.page').then((m) => m.TestPage),
  }]