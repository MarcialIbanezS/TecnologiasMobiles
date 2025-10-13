import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { Patient } from '../Services/patient.service';
import { NavigationService, Breadcrumb } from '../Services/navigation.service';

import { 
  IonContent, IonHeader, IonTitle, IonToolbar, IonCard, IonCardContent, IonCardHeader,
  IonCardSubtitle, IonCardTitle, IonGrid, IonCol, IonRow, IonButton 
} from '@ionic/angular/standalone';

import { IonBreadcrumb, IonBreadcrumbs } from '@ionic/angular/standalone';

@Component({
  selector: 'app-pagina-inicio',
  templateUrl: './pagina-inicio.page.html',
  styleUrls: ['./pagina-inicio.page.scss'],
  standalone: true,
<<<<<<< HEAD:Proyecto/appBakan/src/app/pagina-inicio/pagina-inicio.page.ts
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule
    , IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle, 
    IonGrid, IonCol, IonRow, IonButton, IonBreadcrumb, IonBreadcrumbs, RouterModule]})
export class PaginaInicioPage implements OnInit {
=======
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
>>>>>>> firebase:Proyecto/appBakan/src/app/martin3/martin3.page.ts

  selectedPatient: Patient | null = null;
  breadcrumbs: Breadcrumb[] = [];

<<<<<<< HEAD:Proyecto/appBakan/src/app/pagina-inicio/pagina-inicio.page.ts
  constructor(
    private router: Router,
    private navigationService: NavigationService
  ) {
    // Get patient data from navigation state if it exists
=======
  constructor(private router: Router) {
    // Obtener datos del paciente desde el estado de navegación si existe
>>>>>>> firebase:Proyecto/appBakan/src/app/martin3/martin3.page.ts
    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras.state?.['patient']) {
      this.selectedPatient = navigation.extras.state['patient'];
    } else {
      // Try to get from navigation service
      this.selectedPatient = this.navigationService.getSelectedPatient();
    }
  }
<<<<<<< HEAD:Proyecto/appBakan/src/app/pagina-inicio/pagina-inicio.page.ts
 irAHome() {
    this.router.navigate(['/login']);       
  }
  irAMartin0() {
    this.router.navigate(['/pagina2']);       
  }
  irAPerfilPaciente() {
    // Pass patient data to patient profile if available
    if (this.selectedPatient) {
      this.router.navigate(['/perfilPaciente'], { 
        state: { patient: this.selectedPatient } 
      });
=======

  ngOnInit() {}

  // 🔹 Navegación entre páginas
  irAHome() { this.router.navigate(['/login']); }
  irAMartin0() { this.router.navigate(['/pagina2']); }
  irAMartin1() {
    if (this.selectedPatient) {
      this.router.navigate(['/martin1'], { state: { patient: this.selectedPatient } });
>>>>>>> firebase:Proyecto/appBakan/src/app/martin3/martin3.page.ts
    } else {
      this.router.navigate(['/perfilPaciente']);
    }
  }
<<<<<<< HEAD:Proyecto/appBakan/src/app/pagina-inicio/pagina-inicio.page.ts
  irAListadoPacientes() {
    this.router.navigate(['/listadoPacientes']);       
  }
  irAInicio() {
    this.router.navigate(['/inicio']);       
  }
  irAFichaMedica() {
    this.router.navigate(['/fichaMedica']);       
  }





  ngOnInit() {
    // Build breadcrumbs for patient menu/inicio page
    this.breadcrumbs = [
      { label: 'Inicio', path: '/inicio' }
    ];
  }

  // Execute breadcrumb navigation
  onBreadcrumbClick(breadcrumb: Breadcrumb) {
    this.navigationService.executeBreadcrumbNavigation(breadcrumb);
  }

  // Navigate to medical record with patient context
  verFichaMedica() {
    if (this.selectedPatient) {
      this.navigationService.navigateWithBreadcrumb('/fichaMedica', this.selectedPatient);
    }
  }
=======
  irAMartin2() { this.router.navigate(['/martin2']); }
  irAMartin3() { this.router.navigate(['/martin3']); }
  irAMartin4() { this.router.navigate(['/martin4']); }
  irAMartin5() { this.router.navigate(['/martin5']); }
  irAMartin6() { this.router.navigate(['/martin6']); }
>>>>>>> firebase:Proyecto/appBakan/src/app/martin3/martin3.page.ts

}

