import { Component } from '@angular/core';
import {
  IonApp, IonMenu, IonHeader, IonToolbar, IonTitle, IonContent,
  IonList, IonItem, IonMenuToggle, IonRouterOutlet
} from '@ionic/angular/standalone';
import { NgFor } from '@angular/common';           // 👈 para *ngFor
import { RouterLink} from '@angular/router'; // 👈 para [routerLink]

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: 'app.component.html',
  imports: [
  IonApp, IonMenu, IonHeader, IonToolbar, IonTitle, IonContent,
  IonList, IonItem, IonMenuToggle, IonRouterOutlet, NgFor, RouterLink
],
})
export class AppComponent {
  constructor() {}
    pages = [
    { title: 'Login',  url: '/pagina3' },
    { title: 'Busqueda', url: '/ingreso' },
    { title: 'Ficha medica', url: '/ficha/p001' },
    { title: 'Lista de medicamentos', url: '/triage/p001' },
    { title: 'Reporte del Paciente', url: '/signos/p001' },
    { title: 'Historial del paciente', url: '/meds/p001' },
    { title: 'Dashboard', url: '/historial/p001' },
    { title: 'marcial',    url: '/pagina1' },
    { title: 'martin',    url: '/pagina2' },
    
  ];
}
