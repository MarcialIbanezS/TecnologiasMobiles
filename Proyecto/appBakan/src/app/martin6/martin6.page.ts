import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar,IonCol, IonGrid, IonRow } from '@ionic/angular/standalone';

@Component({
  selector: 'app-martin6',
  templateUrl: './martin6.page.html',
  styleUrls: ['./martin6.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule,IonCol, IonGrid, IonRow]
})
export class Martin6Page implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
