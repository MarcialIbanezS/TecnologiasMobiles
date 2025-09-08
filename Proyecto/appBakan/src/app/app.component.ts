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
    { title: 'Matias',  url: '/pagina3' },
    { title: 'marcial',    url: '/pagina1' },
    { title: 'martin',    url: '/pagina2' },
  ];
}
