import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import { IonBreadcrumb, IonBreadcrumbs } from '@ionic/angular/standalone';
import { Router } from '@angular/router';
import { RouterModule } from '@angular/router';


@Component({
  selector: 'app-marcial3',
  templateUrl: './marcial3.page.html',
  styleUrls: ['./marcial3.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, RouterModule,
    IonToolbar, CommonModule, FormsModule,IonBreadcrumb, IonBreadcrumbs,
  ]
})
export class Marcial3Page implements OnInit {

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
  irAMarcial3() {
    this.router.navigate(['/marcial3']);       
  }
  irAMarcial4() {
    this.router.navigate(['/marcial4']);       
  }
  irAMarcial5() {
    this.router.navigate(['/marcial5']);       
  }
  irAMarcial6() {
    this.router.navigate(['/marcial6']);       
  }

  ngOnInit() {
  }

}


