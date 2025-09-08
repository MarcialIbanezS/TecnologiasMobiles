import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import { IonBreadcrumb, IonBreadcrumbs } from '@ionic/angular/standalone';
import { Router } from '@angular/router';
import { RouterModule } from '@angular/router';
import {
  IonButton,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
} from '@ionic/angular/standalone';


@Component({
  selector: 'app-marcial2',
  templateUrl: './marcial2.page.html',
  styleUrls: ['./marcial2.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, RouterModule,
    IonToolbar, CommonModule, FormsModule, IonBreadcrumb, IonBreadcrumbs]

})

export class Marcial2Page implements OnInit {

  constructor(private router: Router) {}
  
  irAHome() {
    this.router.navigate(['/home']);       
  }
  irAMarcial1() {
    this.router.navigate(['/pagina1']);       
  }
  irAMarcial2() {
    this.router.navigate(['/marcial2']);       
  }
  
  ngOnInit() {
  }

}
