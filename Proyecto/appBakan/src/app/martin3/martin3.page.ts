import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { Patient } from '../Services/patient.service';

import { 
  IonContent, IonHeader, IonTitle, IonToolbar, IonCard, IonCardContent, IonCardHeader,
  IonCardSubtitle, IonCardTitle, IonGrid, IonCol, IonRow, IonButton 
} from '@ionic/angular/standalone';

import { IonBreadcrumb, IonBreadcrumbs } from '@ionic/angular/standalone';

@Component({
  selector: 'app-martin3',
  templateUrl: './martin3.page.html',
  styleUrls: ['./martin3.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    IonCard,
    IonCardContent,
    IonCardHeader,
    IonCardSubtitle,
    IonCardTitle,
    IonGrid,
    IonCol,
    IonRow,
    IonButton,
    IonBreadcrumb,
    IonBreadcrumbs
  ]
})
export class Martin3Page implements OnInit {

  selectedPatient: Patient | null = null;

  constructor(private router: Router) {
    // Obtener datos del paciente desde el estado de navegación si existe
    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras.state?.['patient']) {
      this.selectedPatient = navigation.extras.state['patient'];
    }
  }

  ngOnInit() {}

  // 🔹 Navegación entre páginas
  irAHome() { this.router.navigate(['/login']); }
  irAMartin0() { this.router.navigate(['/pagina2']); }
  irAMartin1() {
    if (this.selectedPatient) {
      this.router.navigate(['/martin1'], { state: { patient: this.selectedPatient } });
    } else {
      this.router.navigate(['/martin1']);
    }
  }
  irAMartin2() { this.router.navigate(['/martin2']); }
  irAMartin3() { this.router.navigate(['/martin3']); }
  irAMartin4() { this.router.navigate(['/martin4']); }
  irAMartin5() { this.router.navigate(['/martin5']); }
  irAMartin6() { this.router.navigate(['/martin6']); }

}
