import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonButton} from '@ionic/angular/standalone';

@Component({
  selector: 'app-martin3',
  templateUrl: './martin3.page.html',
  styleUrls: ['./martin3.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, IonButton]
})
export class Martin3Page implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
