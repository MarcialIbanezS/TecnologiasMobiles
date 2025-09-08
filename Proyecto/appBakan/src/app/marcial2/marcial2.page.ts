import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonBreadcrumb, IonBreadcrumbs } from '@ionic/angular/standalone';
import { Router } from '@angular/router';
import { RouterModule } from '@angular/router';
import {
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonModal,
  IonTitle,
  IonToolbar,
} from '@ionic/angular/standalone';
import { IonImg } from '@ionic/angular/standalone';

@Component({
  selector: 'app-marcial2',
  templateUrl: './marcial2.page.html',
  styleUrls: ['./marcial2.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, RouterModule,
    IonToolbar, CommonModule, FormsModule, IonBreadcrumb, IonBreadcrumbs,
  IonButton, IonButtons, IonContent, IonHeader, IonModal, IonTitle, IonToolbar,IonImg]

})

export class Marcial2Page implements OnInit {

  constructor(private router: Router) {}

  isModalOpen = false;

  setOpen(isOpen: boolean) {
    this.isModalOpen = isOpen;
  }
  
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
