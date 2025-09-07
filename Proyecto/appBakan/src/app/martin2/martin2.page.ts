import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonAlert, IonButton } from '@ionic/angular/standalone';

@Component({
  selector: 'app-martin2',
  templateUrl: './martin2.page.html',
  styleUrls: ['./martin2.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, IonAlert, IonButton]
})
export class Martin2Page implements OnInit {
alertButtons = ['Action'];
  constructor() { }

  ngOnInit() {
  }

}
