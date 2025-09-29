import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonCard, IonCardContent, IonCardHeader, IonCardSubtitle,
   IonCardTitle, IonButton } from '@ionic/angular/standalone';
import {IonBreadcrumb, IonBreadcrumbs} from  '@ionic/angular/standalone';
import {Router} from '@angular/router';
import {RouterModule} from '@angular/router';


@Component({
  selector: 'app-martin4',
  templateUrl: './martin4.page.html',
  styleUrls: ['./martin4.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule,
    IonBreadcrumb, IonBreadcrumbs, RouterModule, IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle,
    IonButton
  ]
})
export class Martin4Page implements OnInit {

  constructor(private router: Router) { }
 irAHome() {
    this.router.navigate(['/login']);       
  }
  irAMartin0() {
    this.router.navigate(['/pagina2']);       
  }
  irAMartin1() {
    this.router.navigate(['/martin1']);       
  }
  irAMartin2() {
    this.router.navigate(['/martin2']);       
  }
  irAMartin3() {
    this.router.navigate(['/martin3']);       
  }
  irAMartin4() {
    this.router.navigate(['/martin4']);       
  }
  irAMartin5() {
    this.router.navigate(['/martin5']);       
  }
  irAMartin6() {
    this.router.navigate(['/martin6']);       
  }
  ngOnInit() {
  }

}
