import { Component } from '@angular/core';
import { IonHeader,IonMenu,IonButtons,IonMenuButton, IonToolbar, IonTitle, IonContent } from '@ionic/angular/standalone';


@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  imports: [IonHeader,IonMenu,IonButtons,IonMenuButton, IonToolbar, IonTitle, IonContent],
})
export class HomePage {
  constructor() {}
}
