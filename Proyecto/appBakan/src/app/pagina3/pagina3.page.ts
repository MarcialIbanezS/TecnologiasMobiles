import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar,IonBreadcrumb, IonBreadcrumbs,
  IonList, IonItem, IonLabel
 } from '@ionic/angular/standalone';
import { Router,RouterLink } from '@angular/router';
import { RouterModule } from '@angular/router';
@Component({
  selector: 'app-pagina3',
  templateUrl: './pagina3.page.html',
  styleUrls: ['./pagina3.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, RouterModule,IonBreadcrumb, IonBreadcrumbs,RouterLink ,IonList, IonItem, IonLabel]
})
export class Pagina3Page implements OnInit {

  constructor(private router: Router) { }

  ngOnInit() {
  }
   irAHome() {
    this.router.navigate(['/home']);       
  }
  irAmatias1() {
    this.router.navigate(['/pagina3']);       
  }
  top5 = [
    { name: 'El goat', url: '/matias2' },
    { name: 'el villano', url: '/matias3' },
    { name: 'bleyder x', url: '/matias4' },
    { name: 'ayton', url: '/matias5' },
    { name: 'sarmisiniestro', url: '/matias6' },
  ];

}
