import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar ,IonBreadcrumb, IonBreadcrumbs } from '@ionic/angular/standalone';
import { Router, RouterModule } from '@angular/router';
@Component({
  selector: 'app-matias3',
  templateUrl: './matias3.page.html',
  styleUrls: ['./matias3.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, RouterModule,IonBreadcrumb, IonBreadcrumbs ]
})
export class Matias3Page implements OnInit {

  constructor(private router: Router) { }

  ngOnInit() {
  }
   irAHome() {
    this.router.navigate(['/home']);       
  }
  irAmatias1() {
    this.router.navigate(['/pagina3']);       
  }
  irAmatias3() {
    this.router.navigate(['/matias3']);       
  }


}
