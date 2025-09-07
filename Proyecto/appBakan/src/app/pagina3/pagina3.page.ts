import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';

@Component({
  selector: 'app-pagina3',
  templateUrl: './pagina3.page.html',
  styleUrls: ['./pagina3.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule]
})
export class Pagina3Page implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
