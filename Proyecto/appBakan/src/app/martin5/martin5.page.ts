import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar,IonChip  } from '@ionic/angular/standalone';

@Component({
  selector: 'app-martin5',
  templateUrl: './martin5.page.html',
  styleUrls: ['./martin5.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule,IonChip ]
})
export class Martin5Page implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
