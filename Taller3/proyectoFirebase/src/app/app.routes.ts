import { Routes } from '@angular/router';
import { TabsPage } from './tabs/tabs.page';

export const routes: Routes = [
  { path: '', redirectTo: 'tabs/tab1', pathMatch: 'full' },
  {
    path: 'tabs',
    component: TabsPage,
    children: [
      { path: 'tab1', loadComponent: () => import('./tab1/tab1.page').then(m => m.Tab1Page) },
      { path: 'tab2', loadComponent: () => import('./tab2/tab2.page').then(m => m.Tab2Page) },
      { path: 'tab3', loadComponent: () => import('./tab3/tab3.page').then(m => m.Tab3Page) },

      // grega tu nueva página dentro de tabs:
      { path: 'libros', loadComponent: () => import('./paginas/libros/libros.page').then(m => m.LibrosPage) },

      { path: '', redirectTo: 'tab1', pathMatch: 'full' },
    ],
  },
];