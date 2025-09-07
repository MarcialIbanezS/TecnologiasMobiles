import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';

@Component({
  selector: 'app-pagina1',
  templateUrl: './pagina1.page.html',
  styleUrls: ['./pagina1.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule]
})
export class Pagina1Page implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
