import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import { IonButton, IonAlert, IonCheckbox, IonDatetime } from '@ionic/angular/standalone';

@Component({
  selector: 'app-pagina2',
  templateUrl: './pagina2.page.html',
  styleUrls: ['./pagina2.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, IonButton, IonAlert, IonCheckbox, 
    IonDatetime]
})
export class Pagina2Page implements OnInit {

  alertButtons = ['Action']; 

  constructor() { }

  ngOnInit() {}
}
