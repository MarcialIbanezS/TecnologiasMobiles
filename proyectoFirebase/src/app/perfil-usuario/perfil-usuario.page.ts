import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar,
  IonCard, IonCardContent, IonCardHeader, IonCardSubtitle,
  IonCardTitle, IonButton, IonNote, IonLabel, IonItem, IonList, IonIcon, IonAvatar
 } from '@ionic/angular/standalone';

@Component({
  selector: 'app-perfil-usuario',
  templateUrl: './perfil-usuario.page.html',
  styleUrls: ['./perfil-usuario.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule,
    IonCard, IonCardContent, IonCardHeader, IonCardSubtitle,
  IonCardTitle, IonButton, IonNote, IonLabel, IonItem, IonList, IonIcon, IonAvatar
  ]
})
export class PerfilUsuarioPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
