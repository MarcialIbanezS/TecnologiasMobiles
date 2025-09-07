import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonAccordion, IonAccordionGroup, IonItem, IonLabel} from '@ionic/angular/standalone';

@Component({
  selector: 'app-martin1',
  templateUrl: './martin1.page.html',
  styleUrls: ['./martin1.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, 
    IonAccordion, IonAccordionGroup, IonItem, IonLabel]
})
export class Martin1Page implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
