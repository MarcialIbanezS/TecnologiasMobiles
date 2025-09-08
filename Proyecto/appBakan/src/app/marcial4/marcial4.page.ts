import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import { IonBreadcrumb, IonBreadcrumbs } from '@ionic/angular/standalone';
import { Router } from '@angular/router';
import { RouterModule } from '@angular/router';
import { IonAlert, IonButton } from '@ionic/angular/standalone';

@Component({
  selector: 'app-marcial4',
  templateUrl: './marcial4.page.html',
  styleUrls: ['./marcial4.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, RouterModule,
    IonToolbar, CommonModule, FormsModule,IonBreadcrumb, IonBreadcrumbs, IonAlert, IonButton
  ]
})
export class Marcial4Page implements OnInit {

  constructor(private router: Router) {}
  
  irAHome() {
    this.router.navigate(['/home']);       
  }
  irAMarcial1() {
    this.router.navigate(['/pagina1']);       
  }

  irAMarcial4() {
    this.router.navigate(['/marcial4']);       
  }
  public alertButtons = ['OK'];
  public alertInputs = [
    {
      label: 'Silker',
      type: 'radio',
      value: 'silk',
    },
    {
      label: 'Skonger',
      type: 'radio',
      value: 'song',
    },

  ];


  ngOnInit() {
  }

}



