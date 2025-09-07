import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar,IonCheckbox } from '@ionic/angular/standalone';

@Component({
  selector: 'app-martin4',
  templateUrl: './martin4.page.html',
  styleUrls: ['./martin4.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule,IonCheckbox]
})
export class Martin4Page implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
