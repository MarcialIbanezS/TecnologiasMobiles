import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar ,IonBreadcrumb, IonBreadcrumbs } from '@ionic/angular/standalone';
import { Router, RouterModule } from '@angular/router';
@Component({
  selector: 'app-matias5',
  templateUrl: './matias5.page.html',
  styleUrls: ['./matias5.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, RouterModule,IonBreadcrumb, IonBreadcrumbs ]
})
export class Matias5Page implements OnInit {

  constructor(private router: Router) { }

  ngOnInit() {
  }
   irAHome() {
    this.router.navigate(['/home']);       
  }
  irAmatias1() {
    this.router.navigate(['/pagina3']);       
  }
  irAmatias5() {
    this.router.navigate(['/matias5']);       
  }


}
